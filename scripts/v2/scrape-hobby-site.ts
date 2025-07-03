import esMain from 'es-main';
import { JSDOM } from 'jsdom';
import path from 'path';
import { fetch } from './fetch';
import type { BandaiHobbyCategory } from '../../src/lib/types'

const DATA_DIR = path.resolve(import.meta.dirname, '../../src/lib/data-v2');
const IMG_DIR = path.resolve(import.meta.dirname, '../../static/images-v2');

type CategoryKey = string;

async function scrapeCategories() {
  const categories: Map<CategoryKey, BandaiHobbyCategory> = new Map()
  // Get the categories in Japanese
  const jpResponse = await fetch('https://bandai-hobby.net/item_all/');
  const jpHtml = await jpResponse.text()
  const jpDom = new JSDOM(jpHtml)
  const jpWindow = jpDom.window;
  const jpDocument = jpWindow.document
  const seriesEls = jpDocument.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="series"]`)
  const brandEls = jpDocument.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="brand"]`)
  const categoryEls = [...seriesEls, ...brandEls]
  for (const categoryEl of categoryEls) {
    const labelEl = jpDocument.querySelector<HTMLLabelElement>(`label[for="${categoryEl.id}"]`)
    if (!labelEl) {
      console.error(`No label found for #${categoryEl.id}`)
      continue;
    }
    const category: BandaiHobbyCategory = {
      kind: categoryEl.name as BandaiHobbyCategory['kind'],
      slug: categoryEl.value,
      nameJp: labelEl.textContent!
    }
    categories.set(categoryEl.id, category)
  }
  console.log(categories)
}

// function getCategoryKey(category: Pick<BandaiHobbyCategory, 'kind' | 'slug'>): CategoryKey {
//   return `${category.kind}_${category.slug}`
// }

if (esMain(import.meta)) {
  scrapeCategories()
}