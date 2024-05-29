<script lang="ts">
	import ProductListItem from '$lib/ProductListItem.svelte';
	import VirtualList from '$lib/VirtualList.svelte';
	import type { Product } from '$lib/types';
	import uniq from 'lodash/uniq';
	import { ALL_BRANDS, ALL_SERIES } from '$lib/categories';

	import '$lib/styles/reset.css';
	import '$lib/styles/root.css';

	import products from '$lib/data/products.json';
	import SidebarGroup from '$lib/SidebarGroup.svelte';
	import SidebarTitle from '$lib/SidebarTitle.svelte';
	import { createCsvQueryParamState, createQueryParamState } from '$lib/state.svelte';
	const productsTyped: Product[] = products as any;

	let sortColumn: keyof Product = 'releaseDate';
	let sortDirection: -1 | 1 = -1;

	let query = createQueryParamState('query', '');
	let enabledYears = createCsvQueryParamState('years', []);

	// This is a kind-of gross way to get a writeable derived state. There's probably a better way
	const fromBrandSlug = (slug: string) => ALL_BRANDS.find((x) => x.slug === slug)?.nameJp!;
	const toBrandSlug = (nameJp: string) => ALL_BRANDS.find((x) => x.nameJp === nameJp)?.slug!;
	let enabledBrandsSlugs = createCsvQueryParamState('grade', []);
	let enabledBrands = $state<string[]>(enabledBrandsSlugs.current.map(fromBrandSlug));
	$inspect(enabledBrands, enabledBrandsSlugs);
	$effect(() => {
		enabledBrandsSlugs.current = enabledBrands.map(toBrandSlug);
	});
	const fromSeriesSlug = (slug: string) => ALL_SERIES.find((x) => x.slug === slug)?.nameJp!;
	const toSeriesSlug = (nameJp: string) => ALL_SERIES.find((x) => x.nameJp === nameJp)?.slug!;
	let enabledSeriesSlugs = createCsvQueryParamState('series', []);
	let enabledSeries = $state<string[]>(enabledSeriesSlugs.current.map(fromSeriesSlug));
	$effect(() => {
		enabledSeriesSlugs.current = enabledSeries.map(toSeriesSlug);
	});

	const allYears = uniq(
		Object.values(productsTyped).map((product) => {
			if (product.releaseDate === 'N/A') return 'N/A';
			return product.releaseDate.slice(0, 4);
		})
	).toSorted((a, b) => {
		if (a === 'N/A') return 1;
		if (b === 'N/A') return -1;
		return -a.localeCompare(b);
	});

	let productsSorted: Product[] = $derived(
		productsTyped
			.filter((product) => {
				if (enabledBrands.length > 0 && !enabledBrands.includes(product.brand)) {
					return false;
				}
				if (enabledSeries.length > 0 && !enabledSeries.includes(product.series)) {
					return false;
				}
				if (
					enabledYears.current.length > 0 &&
					!enabledYears.current.some((year) => product.releaseDate.startsWith(year))
				) {
					return false;
				}
				if (
					query.current.length > 0 &&
					!(
						product.nameEn.toLocaleLowerCase().includes(query.current.toLocaleLowerCase()) ||
						product.nameJp.toLocaleLowerCase().includes(query.current.toLocaleLowerCase())
					)
				) {
					return false;
				}
				return true;
			})
			.toSorted((a, b) => {
				// Special case for this private release
				if (a[sortColumn] === 'N/A') return 1;
				if (b[sortColumn] === 'N/A') return -1;

				const comparison = a[sortColumn].localeCompare(b[sortColumn]);
				// return -1 * comparison;
				return sortDirection * comparison;
			})
	);

	// scroll to top when the list changes
	let viewportRef: { get(): HTMLElement } | undefined = $state(undefined);
	$effect(() => {
		const _ = productsSorted;
		if (viewportRef) {
			viewportRef.get().scrollTop = 0;
		}
	});
</script>

<svelte:head>
	<title>gunpla.wtf — Gunpla database</title>
</svelte:head>

<div class="root">
	<div class="sidebar">
		<h1>gunpla.wtf</h1>

		<div class="search">
			<SidebarTitle>Search</SidebarTitle>
			<input type="search" bind:value={query.current} />
		</div>

		<SidebarGroup
			title="Release Date"
			items={allYears}
			getID={(year) => year}
			bind:enabledItems={enabledYears.current}
			let:item={year}
		>
			{year}
		</SidebarGroup>
		<SidebarGroup
			title="Grade"
			items={ALL_BRANDS}
			getID={(brand) => brand.nameJp}
			bind:enabledItems={enabledBrands}
			let:item={brand}
		>
			{brand.nameEn}
		</SidebarGroup>
		<SidebarGroup
			title="Series"
			items={ALL_SERIES}
			getID={(series) => series.nameJp}
			bind:enabledItems={enabledSeries}
			let:item={series}
		>
			{series.nameEn}
		</SidebarGroup>
	</div>
	<div class="table">
		<VirtualList items={productsSorted} let:item bind:viewportRef>
			{#key item.nameJp}
				<ProductListItem
					product={item}
					onBrandClick={(brand) => {
						enabledBrands = [brand];
					}}
					onSeriesClick={(series) => {
						enabledSeries = [series];
					}}
				/>
			{/key}
		</VirtualList>
	</div>
</div>

<style lang="scss">
	.root {
		display: flex;
		flex-direction: row;
		height: 100%;
		width: 100%;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		flex: 0 0 360px;
		border-right: 1px solid var(--border-color);
		overflow-y: hidden;
	}

	h1 {
		padding: 16px;
		font-weight: 900;
		font-size: 150%;
		border-bottom: 1px solid var(--border-color);
		flex-shrink: 0;
	}

	.search {
		display: flex;
		flex-direction: column;
		border-bottom: 1px solid var(--border-color);
		flex-shrink: 0;

		input {
			margin: 0 16px 16px;
			border-radius: 1000px;
			border: 1px solid #ccc;
			padding: 0 12px;
		}
	}

	.table {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
	}
</style>
