import esMain from 'es-main';
import fs from 'fs/promises'
import { JSDOM } from 'jsdom';
import path from 'path';
import { fetch } from './fetch';
import type { BandaiHobbyCategory } from '../../src/lib/types'

const DATA_DIR = path.resolve(import.meta.dirname, '../../src/lib/data-v2');
const IMG_DIR = path.resolve(import.meta.dirname, '../../static/images-v2');

const CATEGORIES_PATH = path.resolve(DATA_DIR, 'bandai-hobby-categories.json')

type CategoryKey = string;

async function scrapeCategories() {
  const categories: Record<CategoryKey, BandaiHobbyCategory> = {}

  // Get the categories in Japanese
  console.log('Fetching Japanese categories from bandai-hobby.net ...')
  const jpResponse = await fetch('https://bandai-hobby.net/item_all/');
  const jpHtml = await jpResponse.text()
  const jpDom = new JSDOM(jpHtml)
  const jpDocument = jpDom.window.document
  const seriesEls = jpDocument.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="series"]`)
  const brandEls = jpDocument.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="brand"]`)
  const categoryEls = [...seriesEls, ...brandEls]
  for (const categoryEl of categoryEls) {
    const labelEl = jpDocument.querySelector<HTMLLabelElement>(`label[for="${categoryEl.id}"]`)
    const labelText = labelEl?.textContent
    if (!labelText) {
      // This should never happen!!
      console.error(`  No Japanese label found for #${categoryEl.id}`)
      continue;
    }
    const category: BandaiHobbyCategory = {
      kind: categoryEl.name as BandaiHobbyCategory['kind'],
      slug: categoryEl.value,
      nameJp: labelText
    }
    categories[categoryEl.id] = category
  }
  console.log('Done!')

  // Get the English names. Not every category will have an English name...
  console.log('Fetching English category names from global.bandai-hobby.net ...')
  const enResponse = await fetch('https://global.bandai-hobby.net/en-us/item_all/');
  const enHtml = await enResponse.text()
  const enDom = new JSDOM(enHtml)
  const enDocument = enDom.window.document
  for (const [id, category] of Object.entries(categories)) {
    const labelEl = enDocument.querySelector<HTMLLabelElement>(`label[for="${id}"]`)
    const labelText = labelEl?.textContent
    if (!labelText) {
      console.error(`  No English label found for #${id}`)
      continue;
    }
    category.nameEn = labelText
  }
  console.log('Done!')

  // Write the file to disk
  console.log('Writing categories file to disk ...')
  await fs.writeFile(CATEGORIES_PATH, JSON.stringify(categories, null, '\t'))
  console.log('Done!')
}

// function getCategoryKey(category: Pick<BandaiHobbyCategory, 'kind' | 'slug'>): CategoryKey {
//   return `${category.kind}_${category.slug}`
// }

if (esMain(import.meta)) {
  scrapeCategories()
}