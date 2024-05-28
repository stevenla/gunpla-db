<script lang="ts">
	import products from '$lib/products.json';
	import ProductListItem from '$lib/ProductListItem.svelte';
	import VirtualList from '$lib/VirtualList.svelte';
	// import VirtualList from '@sveltejs/svelte-virtual-list';
	// import VirtualList from 'svelte-tiny-virtual-list';
	import type { Product } from '$lib/types';

	import '$lib/styles/reset.css';

	const productsTyped: Product[] = products as any;
	let sortColumn: keyof Product = 'releaseDate';
	let sortDirection: -1 | 1 = -1;

	const productsSorted: Product[] = productsTyped.toSorted((a, b) => {
		// Special case for this private release
		if (a[sortColumn] === '非公開') return 1;
		if (b[sortColumn] === '非公開') return -1;

		const comparison = a[sortColumn].localeCompare(b[sortColumn]);
		// return -1 * comparison;
		return sortDirection * comparison;
	});
</script>

<div class="listWrapper">
	<VirtualList items={productsSorted} let:item>
		<ProductListItem product={item} />
	</VirtualList>
</div>

<style lang="scss">
	.listWrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}
</style>
