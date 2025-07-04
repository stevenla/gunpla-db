import esMain from 'es-main';
import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import isEqual from 'lodash/isEqual';
import { mkdirp } from 'mkdirp';
import path from 'path';
import type {
	BandaiHobbyCategory,
	BandaiHobbyCategoryItems,
	BandaiHobbyItem
} from '../../src/lib/types';
import { block, error, fetch, filterNull, log, parseJpy, sha256, translateDate } from './helpers';
import fileTypeChecker from 'file-type-checker';

const CACHE_DIR = path.resolve(import.meta.dirname, './cache');
// const DATA_DIR = path.resolve(import.meta.dirname, '../../src/lib/data-v2');
const IMG_DIR = path.resolve(import.meta.dirname, '../../static/images-v2');

const CATEGORY_ITEM_DIR = path.resolve(CACHE_DIR, 'bandai-hobby/category-items/');
const CATEGORIES_PATH = path.resolve(CACHE_DIR, 'bandai-hobby/categories.json');
const ITEMS_PATH = path.resolve(CACHE_DIR, 'bandai-hobby/items.json');

type CategoryKey = string;

async function scrapeCategories() {
	const categories: Record<CategoryKey, BandaiHobbyCategory> = {};

	await block('Fetching Japanese categories from bandai-hobby.net', async () => {
		const jpResponse = await fetch('https://bandai-hobby.net/item_all/');
		const jpHtml = await jpResponse.text();
		const jpDom = new JSDOM(jpHtml);
		const jpDocument = jpDom.window.document;
		const seriesEls = jpDocument.querySelectorAll<HTMLInputElement>(
			`input[type="checkbox"][name="series"]`
		);
		const brandEls = jpDocument.querySelectorAll<HTMLInputElement>(
			`input[type="checkbox"][name="brand"]`
		);
		const categoryEls = [...seriesEls, ...brandEls];
		for (const categoryEl of categoryEls) {
			const labelEl = jpDocument.querySelector<HTMLLabelElement>(`label[for="${categoryEl.id}"]`);
			const labelText = labelEl?.textContent;
			if (!labelText) {
				// This should never happen!!
				error(`No Japanese label found for #${categoryEl.id}`);
				continue;
			}
			const category: BandaiHobbyCategory = {
				kind: categoryEl.name as BandaiHobbyCategory['kind'],
				slug: categoryEl.value,
				nameJp: labelText
			};
			categories[categoryEl.id] = category;
		}
	});

	await block('Fetching English category names from global.bandai-hobby.net', async () => {
		const enResponse = await fetch('https://global.bandai-hobby.net/en-us/item_all/');
		const enHtml = await enResponse.text();
		const enDom = new JSDOM(enHtml);
		const enDocument = enDom.window.document;
		for (const [id, category] of Object.entries(categories)) {
			const labelEl = enDocument.querySelector<HTMLLabelElement>(`label[for="${id}"]`);
			const labelText = labelEl?.textContent;
			if (!labelText) {
				error(`No English label found for #${id}`);
				continue;
			}
			category.nameEn = labelText;
		}
	});

	await block('Writing categories file to disk', async () => {
		await fs.writeFile(CATEGORIES_PATH, JSON.stringify(categories, null, '\t'));
	});
	return categories;
}

// function getCategoryKey(category: Pick<BandaiHobbyCategory, 'kind' | 'slug'>): CategoryKey {
//   return `${category.kind}_${category.slug}`
// }

async function scrapeCategory(
	items: Record<string, BandaiHobbyItem>,
	category: BandaiHobbyCategory
) {
	const categoryItems: BandaiHobbyCategoryItems = {
		kind: category.kind,
		slug: category.slug,
		itemUrls: []
	};
	const baseUrl = new URL(`https://bandai-hobby.net/${category.kind}/${category.slug}/`);
	// Some arbitrarily large number
	for (let pageNumber = 1; pageNumber < 1000; pageNumber++) {
		let shouldKeepFetching = false;
		await block(`Fetching "${category.kind}/${category.slug}" page=${pageNumber}`, async () => {
			const url = new URL(baseUrl);
			url.searchParams.append('p', String(pageNumber));
			const response = await fetch(url.toString());
			const html = await response.text();
			const dom = new JSDOM(html);
			const document = dom.window.document;

			// On page 1, download the image for the category
			if (pageNumber === 1) {
				const imgUrl = document.querySelector<HTMLImageElement>('.pg-brand__brandImg img')?.src;
				if (imgUrl != null) {
					categoryItems.thumbnailUrl = await downloadImage(imgUrl);
				}
			}

			const cardEls = document.querySelectorAll<HTMLAnchorElement>('a.p-card');
			log(`Found ${cardEls.length} items`);
			if (cardEls.length === 0) {
				shouldKeepFetching = false;
				return;
			}
			for (const cardEl of cardEls) {
				const imgUrl = cardEl.querySelector<HTMLImageElement>('.p-card__img img')?.src;
				const imgCleanUrl = imgUrl ? await downloadImage(imgUrl) : undefined;
				const tags = filterNull(
					[...cardEl.querySelectorAll('.p-card__tag')].map((el) => el.textContent)
				);
				const msrpStr = cardEl.querySelector('.p-card__price')?.textContent;
				const msrpJpy = msrpStr ? parseJpy(msrpStr) : undefined;
				const releaseDateJpStr = cardEl.querySelector('.p-card_date')?.textContent;
				const releaseDate = releaseDateJpStr ? translateDate(releaseDateJpStr) : undefined;
				const oldItem: BandaiHobbyItem | undefined = items[cardEl.href];
				const newItem: BandaiHobbyItem = {
					itemUrl: cardEl.href,
					nameJp: cardEl.querySelector('.p-card__tit')?.textContent ?? '',
					thumbnailUrl: imgCleanUrl,
					tags,
					msrpJpy,
					releaseDate
				};
				items[cardEl.href] = newItem;
				categoryItems.itemUrls.push(cardEl.href);
				// If one of the items got updated, then we should keep fetching until we get a full page
				// of cache hits.
				if (!isEqual(oldItem, newItem)) {
					shouldKeepFetching = true;
				}
				// If the release date for the item is in the future, then we should keep fetching until
				// we get a full page of past releases.
				if (releaseDate && new Date() < new Date(releaseDate)) {
					shouldKeepFetching = true;
				}
			}
			// If the next page element has the class .is-inert, then it's disabled with CSS and we
			// should stop fetching.
			const nextPageEl = document.querySelector('.p-pagination__nextList');
			const hasNextPage = nextPageEl ? !nextPageEl.classList.contains('is-inert') : false;
			if (!hasNextPage) {
				shouldKeepFetching = false;
			}
		});
		if (!shouldKeepFetching) {
			break;
		}
	}

	await block(`Writing category items for "${category.kind}/${category.slug}"`, async () => {
		const dir = path.resolve(CATEGORY_ITEM_DIR, category.kind);
		await mkdirp(dir);
		await fs.writeFile(
			path.resolve(dir, `${category.slug}.json`),
			JSON.stringify(categoryItems, null, '\t')
		);
	});

	return categoryItems;
}

async function downloadImage(urlString: string, filePath?: string) {
	const url = new URL(urlString);
	url.search = '';
	const cleanUrl = url.toString();
	const ext = path.extname(url.pathname);
	let localPath = filePath;
	if (localPath == null) {
		const hash = await sha256(cleanUrl);
		localPath = path.resolve(IMG_DIR, `${hash}${ext}`);
	}
	try {
		await fs.readFile(localPath);
		return cleanUrl;
	} catch (_) {
		return await block(`Downloading image "${cleanUrl}`, async () => {
			const res = await fetch(urlString);
			const buf = await res.arrayBuffer();
			if (!fileTypeChecker.validateFileType(buf, [ext])) {
				error(`File type not valid for "${urlString}"\n${new TextDecoder().decode(buf)}`);
				return;
			}
			const { body } = res;
			if (!body) {
				error(`No body for "${urlString}"`);
				return;
			}
			await fs.writeFile(localPath, body);
			return cleanUrl;
		});
	}
}

if (esMain(import.meta)) {
	const categories = await scrapeCategories();

	let items: Record<string, BandaiHobbyItem> = {};
	await block('Reading items list', async () => {
		try {
			const res = await fs.readFile(ITEMS_PATH, 'utf-8');
			items = JSON.parse(res);
			log(`Found ${Object.keys(items).length} existing items`);
		} catch (_) {
			// nothing
		}
	});

	for (const category of Object.values(categories)) {
		await scrapeCategory(items, category);

		// Write the items list every time, just in case something crashes
		await block('Writing items list', async () => {
			await fs.writeFile(ITEMS_PATH, JSON.stringify(items, null, '\t'));
		});
	}
}
