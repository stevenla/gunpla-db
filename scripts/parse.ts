import fs from 'fs/promises'
import esMain from 'es-main'
import path from 'path'
import { JSDOM } from 'jsdom'

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
    return parseFile(id);
  })
  const products = await Promise.all(productListPromises);

  await fs.writeFile(path.resolve(CACHEDIR, 'products.json'), JSON.stringify(products, null, 2));
}

if (esMain(import.meta)) {
  parseAll();
}