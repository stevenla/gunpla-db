# gunpla.fyi

A searchable database of Bandai gunpla (plamo) models, scraped from [manual.bandai-hobby.net](https://manual.bandai-hobby.net).

## Features

- Browse hundreds of gunpla products with box art images
- Search by name (English or Japanese), brand, or series
- Filter by grade (HG, HGUC, PG, RG, etc.), series, and release year
- Sorted by default by release date (newest first)
- Click any grade or series badge to filter by that category
- Links to official Bandai hobby detail pages and box art images

## Tech Stack

- **Framework:** Svelte 5 + SvelteKit (SSR/SPA)
- **Language:** TypeScript
- **Styling:** SCSS with CSS custom properties and container queries
- **Virtual scrolling:** [virtua](https://github.com/inokawa/virtua) for performant large list rendering
- **Build:** Vite 8
- **Deploy:** Static site via `gh-pages` → [gunpla.fyi](https://gunpla.fyi)

## Architecture

### Data flow

1. **Scrape** (`npm run fetch`): `scrape.ts` paginates `manual.bandai-hobby.net`, caches raw HTML and images, then stops when it detects a loop back to already-cached pages.
2. **Parse**: `parse.ts` reads the cached HTML files, extracts structured product data via JSDOM DOM queries, and writes `products.json`.
3. **Build**: `products.json` is copied into `src/lib/data/` and bundled into the static site by Vite.
4. **Serve**: SvelteKit generates a static site. The client loads all data as JSON, derives filtered/sorted lists reactively via Svelte 5 `$state`/`$derived`/`$effect`, and syncs filters to URL query params.

### Key design decisions

- **No API, no database** — everything is static JSON baked at build time. This means zero server costs and instant page loads.
- **Client-side filtering** — all search and filtering happens in the browser using Svelte 5's reactivity. The URL query params serve as the single source of truth for filter state.
- **Virtual scrolling** — `virtua`'s `VList` renders only visible product rows, keeping memory and DOM size low even with 1400+ products.
- **Cache-aware scraping** — the scraper detects when it has already seen a product (by checking the cache) to stop paginating, avoiding infinite loops from the Bandai site's page-number overflow behavior.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build static site |
| `npm run preview` | Preview production build |
| `npm run fetch` | Scrape + parse fresh data |
| `npm run clean-cache` | Delete all scraped cache |
| `npm run deploy` | Build and deploy to gh-pages |

## License

Private
