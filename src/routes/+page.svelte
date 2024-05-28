<script lang="ts">
	import ProductListItem from '$lib/ProductListItem.svelte';
	import VirtualList from '$lib/VirtualList.svelte';
	import type { Product } from '$lib/types';
	import uniq from 'lodash/uniq';

	import '$lib/styles/reset.css';
	import '$lib/styles/root.css';

	import products from '$lib/data/products.json';

	const productsTyped: Product[] = products as any;
	let sortColumn: keyof Product = 'releaseDate';
	let sortDirection: -1 | 1 = -1;

	// const allSeries = uniq(productsTyped.map((product) => product.series));
	// console.log(allSeries);

	// const allBrands = uniq(productsTyped.map((product) => product.brand));
	// console.log(allBrands);

	const productsSorted: Product[] = productsTyped.toSorted((a, b) => {
		// Special case for this private release
		if (a[sortColumn] === 'N/A') return 1;
		if (b[sortColumn] === 'N/A') return -1;

		const comparison = a[sortColumn].localeCompare(b[sortColumn]);
		// return -1 * comparison;
		return sortDirection * comparison;
	});
</script>

<div class="root">
	<div class="sidebar"></div>
	<div class="table">
		<VirtualList items={productsSorted} let:item>
			<ProductListItem product={item} />
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
	}

	.table {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
	}
</style>
