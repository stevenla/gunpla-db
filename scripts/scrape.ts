import { default as nodeFetch, RequestInfo, RequestInit } from 'node-fetch';
import fs from 'fs/promises'
import { JSDOM } from 'jsdom'
import path from 'path'
import esMain from 'es-main'
import { mkdirp } from 'mkdirp'

const CACHEDIR = path.resolve(import.meta.dirname, 'cache');
const STATICDIR = path.resolve(import.meta.dirname, '..', 'static');
const LISTINFO = path.resolve(CACHEDIR, 'listInfo.json');
const BOXARTDIR = path.resolve(STATICDIR, 'images', 'boxarts')

export const fetch = (url: RequestInfo, { headers, ...options }: RequestInit = {}) => {
  return nodeFetch(url, {
    headers: {
      "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',
      ...headers,
    },
    ...options,
  });
};

async function fetchDetailHTML(id: string): Promise<{ html: string, cached: boolean }> {
  const cacheFolder = path.resolve(CACHEDIR, 'details')
  const cachePath = path.resolve(cacheFolder, `${id}.html`)
  try {
    // Try reading from cache
    const cachedBuf = await fs.readFile(cachePath);
    return { html: cachedBuf.toString(), cached: true };
  } catch (e) {
    console.error(`Fetching detail id=${id}...`);
    // Otherwise fetch
    const fetchRes = await fetch(`https://manual.bandai-hobby.net/menus/detail/${id}`);
    const html = await fetchRes.text();
    await mkdirp(cacheFolder)
    await fs.writeFile(cachePath, html);
    return { html, cached: false };
  }
}

async function writeImageSrc(p: string, src: string): Promise<void> {
  try {
    // Try reading from cache
    await fs.readFile(p);
  } catch (_) {
    console.error(`Downloading image src=${src}...`)
    try {
      const res = await fetch(src)
      const { body } = res;
      if (body) {
        return fs.writeFile(p, body);
      }
    } catch (e) {
      console.error(e)
    }
  }
}

async function cacheImages(id: string, anchor: HTMLAnchorElement) {
  // TODO: check if image already exists on disk
  const boxartImg = anchor.querySelector<HTMLImageElement>('.bl_result_img img');
  const boxartSrc = boxartImg?.src;
  if (boxartSrc) {
    await mkdirp(BOXARTDIR)
    await writeImageSrc(path.resolve(BOXARTDIR, `${id}.jpeg`), boxartSrc)
  }

  const otherImgs = [...anchor.querySelectorAll<HTMLImageElement>('.bl_result_icon img')];
  const otherSrcs = otherImgs.map(img => img.src);
  const otherSrcDownloadPromises = otherSrcs.map(async src => {
    const split = src.split('/');
    await mkdirp(path.resolve(STATICDIR, ...split.slice(0, -1)))
    return await writeImageSrc(path.resolve(STATICDIR, ...split), 'https://manual.bandai-hobby.net' + src);
  })
  await Promise.all(otherSrcDownloadPromises);
}

async function fetchAll() {
  let page = 1;

  const idToListInfo: Record<string, { nameEn: string }> = {};

  while (true) {
    try {
      console.error(`Fetching list page=${page}...`);
      // Keep going next until we find something that's cached
      const fetchRes = await fetch(`https://manual.bandai-hobby.net/?page=${page}`);
      const html = await fetchRes.text();
      const dom = new JSDOM(html);
      const doc = dom.window.document;
      const anchors = [...doc.querySelectorAll<HTMLAnchorElement>('.bl_result_item a')];
      if (anchors.length === 0) break;

      const detailFetchPromises = anchors.map((anchor: HTMLAnchorElement) => {
        const id = anchor.getAttribute('href')?.replace(/[^0-9]/g, '');
        if (!id) return Promise.resolve(null);
        cacheImages(id, anchor);
        idToListInfo[id] = { nameEn: anchor.querySelector('.bl_result_name_en')?.textContent ?? "" };
        return fetchDetailHTML(id);
      })

      const details = await Promise.all(detailFetchPromises);
      // If we have ANY cached page, then we don't need to fetch the next page because things are
      // in chronological order.
      const hasCachedValue = details.some(detail => {
        if (!detail) return false;
        return detail.cached;
      })
      // This site has a quirk where if the page number exceeds the number of pages, we loop back to
      // page 1. We can abuse our cache logic to stop scraping once we get everything.
      if (hasCachedValue) {
        break;
      }
      // if (page >= 60) break;
      page++;

    } catch (error) {
      console.error(error)
    }
  }

  let oldListInfo = {};
  try {
    const contents = await fs.readFile(LISTINFO);
    const json = JSON.parse(contents.toString());
    oldListInfo = json;
  } catch (_) { };
  await fs.writeFile(LISTINFO, JSON.stringify({ ...oldListInfo, ...idToListInfo }, null, 2));
}

if (esMain(import.meta)) {
  fetchAll();
}
