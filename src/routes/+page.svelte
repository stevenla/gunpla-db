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
	const productsTyped: Product[] = products as any;

	let sortColumn: keyof Product = 'releaseDate';
	let sortDirection: -1 | 1 = -1;

	let enabledBrands: string[] = $state([]);
	let enabledSeries: string[] = $state([]);
	let enabledYears: string[] = $state([]);
	let viewportRef: { get(): HTMLElement } | undefined = $state(undefined);

	// scroll to top when any of these change
	$effect(() => {
		const _ = { enabledBrands, enabledSeries, enabledYears };
		if (viewportRef) {
			viewportRef.get().scrollTop = 0;
		}
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
				if (enabledBrands.length > 0 && !enabledBrands.includes(product.brand)) return false;
				if (enabledSeries.length > 0 && !enabledSeries.includes(product.series)) return false;
				if (
					enabledYears.length > 0 &&
					!enabledYears.some((year) => product.releaseDate.startsWith(year))
				)
					return false;
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
</script>

<div class="root">
	<div class="sidebar">
		<SidebarGroup
			title="Release Date"
			items={allYears}
			getID={(year) => year}
			bind:enabledItems={enabledYears}
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
				<ProductListItem product={item} />
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
		flex: 0 0 384px;
		border-right: 1px solid var(--border-color);
		overflow-y: scroll;
	}

	.table {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
	}
</style>
