import fs from 'fs/promises'
import esMain from 'es-main'
import path from 'path'
import { JSDOM } from 'jsdom'
import Throttle from 'promise-parallel-throttle'
import brands from '../src/lib/data/brands.json'
import series from '../src/lib/data/series.json'

const CACHEDIR = path.resolve(import.meta.dirname, 'cache')
import listInfo from './cache/listInfo.json';

const DT_TRANSLATIONS = {
  "品番": "partNo",
  "発売日": "releaseDate",
  "ブランド": "brand",
  "作品": "series",
} as const;

type Product = {
  id: string,
  brand: string,
  partNo: string,
  releaseDate: string,
  nameJp: string,
  nameEn: string,
  series: string,
}

function translateReleaseDate(jp: string): string {
  const match = jp.match(/(\d+)年(\d+)月(\d+)?日?/);
  if (match) {
    const [, y, m, d] = match;
    const year = y.padStart(4, '0');
    const month = m.padStart(2, '0');
    if (d) {
      return `${year}-${month}-${d.padStart(2, '0')}`
    } else {
      return `${year}-${month}`
    }
  }
  return "N/A"
}

async function parseFile(id: string) {
  console.error(`Parsing file id=${id}`);
  const buf = await fs.readFile(path.resolve(CACHEDIR, 'details', `${id}.html`));
  const dom = new JSDOM(buf);
  const doc = dom.window.document;
  const nameJp = doc.querySelector('.el_title')?.textContent!;
  const nameEn = listInfo[id].nameEn as string;
  const defEls = [...doc.querySelectorAll<HTMLDListElement>('.bl_detail_box_item')]
  const defs: Pick<Product, typeof DT_TRANSLATIONS[keyof typeof DT_TRANSLATIONS]> = defEls.reduce((acc, defEl) => {
    const dt = defEl.querySelector('dt')?.textContent?.trim()!;
    const dd = defEl.querySelector('dd')?.textContent?.trim()!;
    acc[DT_TRANSLATIONS[dt]] = dd;
    return acc;
  }, {} as any);
  const product: Product = {
    id,
    nameJp,
    nameEn,
    ...defs
  };
  product.releaseDate = translateReleaseDate(product.releaseDate);
  return product;
}

async function parseAll() {
  const filenames = await fs.readdir(path.resolve(CACHEDIR, 'details'));
  const productListPromises = filenames.map(filename => {
    const id = path.basename(filename, '.html');
    return () => parseFile(id);
  })
  const products = await Throttle.all(productListPromises, { maxInProgress: 10 });

  for (const product of products) {
    if (!(product.brand in brands)) {
      const iconUrl = listInfo[product.id]?.brandIconUrl as string | undefined;
      if (!iconUrl) continue;
      const imageIndex = iconUrl.split('/').pop()?.replace('.jpeg', '');
      brands[product.brand] = {
        slug: imageIndex,
        nameEn: product.brand,
        imageIndex,
        nameJp: product.brand
      };
    }
    if (!(product.series in series)) {
      const iconUrl = listInfo[product.id]?.seriesIconUrl as string | undefined;
      if (!iconUrl) continue;
      const imageIndex = iconUrl.split('/').pop()?.replace('.jpeg', '');
      series[product.series] = {
        slug: imageIndex,
        nameEn: product.series,
        imageIndex,
        nameJp: product.series,
        year: 9999
      };
    }
  }

  await fs.writeFile(path.resolve(CACHEDIR, 'products.json'), JSON.stringify(products, null, 2));
  await fs.writeFile(path.resolve(import.meta.dirname, '..', 'src', 'lib', 'data', 'brands.json'), JSON.stringify(brands, null, 2));
  await fs.writeFile(path.resolve(import.meta.dirname, '..', 'src', 'lib', 'data', 'series.json'), JSON.stringify(series, null, 2));
}

if (esMain(import.meta)) {
  parseAll();
}