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
			items={allYears}
			getID={(item) => item}
			bind:enabledItems={enabledYears}
			let:item={year}
		>
			{year}
		</SidebarGroup>

		<div>---</div>
		{#each ALL_BRANDS as brand}
			<label>
				<input
					type="checkbox"
					checked={enabledBrands.includes(brand.nameJp)}
					onchange={(event) => {
						if (event.currentTarget.checked) {
							enabledBrands.push(brand.nameJp);
						} else {
							enabledBrands.splice(enabledBrands.indexOf(brand.nameJp), 1);
						}
					}}
				/>
				{brand.nameEn}
			</label>
		{/each}
		<div>---</div>
		{#each ALL_SERIES as series}
			<label>
				<input
					type="checkbox"
					checked={enabledSeries.includes(series.nameJp)}
					onchange={(event) => {
						if (event.currentTarget.checked) {
							enabledSeries.push(series.nameJp);
						} else {
							enabledSeries.splice(enabledSeries.indexOf(series.nameJp), 1);
						}
					}}
				/>
				{series.nameEn}
			</label>
		{/each}
	</div>
	<div class="table">
		<VirtualList items={productsSorted} let:item>
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
		flex: 0 0 300px;
		border-right: 1px solid var(--border-color);
		overflow-y: scroll;
	}

	.table {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
	}
</style>
