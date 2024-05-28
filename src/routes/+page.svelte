<script lang="ts">
	import ProductListItem from '$lib/ProductListItem.svelte';
	import VirtualList from '$lib/VirtualList.svelte';
	import type { Product } from '$lib/types';
	import uniq from 'lodash/uniq';
	import { ALL_BRANDS } from '$lib/categories';

	import { produce } from 'immer';

	import '$lib/styles/reset.css';
	import '$lib/styles/root.css';

	import products from '$lib/data/products.json';

	const productsTyped: Product[] = products as any;
	let sortColumn: keyof Product = 'releaseDate';
	let sortDirection: -1 | 1 = -1;

	let enabledBrands: Set<string> = $state(new Set(ALL_BRANDS.map((brand) => brand.nameJp)));

	let productsSorted: Product[] = $derived(
		productsTyped
			.filter((product) => {
				if (!enabledBrands.has(product.brand)) return false;
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
		{#each ALL_BRANDS as brand}
			<label>
				<input
					type="checkbox"
					checked={enabledBrands.has(brand.nameJp)}
					onchange={(event) => {
						if (event.currentTarget.checked) {
							const newEnabledBrands = new Set(enabledBrands);
							newEnabledBrands.add(brand.nameJp);
							enabledBrands = newEnabledBrands;
						} else {
							const newEnabledBrands = new Set(enabledBrands);
							newEnabledBrands.delete(brand.nameJp);
							enabledBrands = newEnabledBrands;
						}
					}}
				/>
				{brand.nameEn}
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
	}

	.table {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
	}
</style>
