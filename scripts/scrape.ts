import fetch from 'node-fetch';
import fs from 'fs/promises'
import { JSDOM } from 'jsdom'
import path from 'path'
import esMain from 'es-main'

const CACHEDIR = path.resolve(import.meta.dirname, 'cache')
const LISTINFO = path.resolve(CACHEDIR, 'listInfo.json');

async function fetchDetailHTML(id: string): Promise<{ html: string, cached: boolean }> {
  const cachePath = path.resolve(CACHEDIR, 'details', `${id}.html`)
  try {
    // Try reading from cache
    const cachedBuf = await fs.readFile(cachePath);
    return { html: cachedBuf.toString(), cached: true };
  } catch (e) {
    console.error(`Fetching detail id=${id}...`);
    // Otherwise fetch
    const fetchRes = await fetch(`https://manual.bandai-hobby.net/menus/detail/${id}`);
    const html = await fetchRes.text();
    await fs.writeFile(cachePath, html);
    return { html, cached: false };
  }
}

async function writeImageSrc(p: string, src: string): Promise<void> {
  const res = await fetch(src)
  const { body } = res;
  if (body) {
    return fs.writeFile(p, body);
  }
}

async function cacheImages(id: string, anchor: HTMLAnchorElement) {
  const boxartImg = anchor.querySelector<HTMLImageElement>('.bl_result_img img');
  const boxartSrc = boxartImg?.src;
  if (boxartSrc) {
    await writeImageSrc(path.resolve(CACHEDIR, 'images', 'boxarts', `${id}.jpeg`), boxartSrc)
  }

  const otherImgs = [...anchor.querySelectorAll<HTMLImageElement>('.bl_result_icon img')];
  const otherSrcs = otherImgs.map(img => img.src);
  const otherSrcDownloadPromises = otherSrcs.map(src => {
    const split = src.split('/');
    return writeImageSrc(path.resolve(CACHEDIR, ...split), 'https://manual.bandai-hobby.net' + src);
  })
  await Promise.all(otherSrcDownloadPromises);
}

async function fetchAll() {
  let page = 1;

  let idToListInfo: Record<string, { nameEn: string }> = {};

  while (true) {
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
