<script lang="ts">
	import { type Product } from '$lib/types';
	export let product: Product;
</script>

<div class="root">
	<img src={`/images/boxarts/${product.id}.jpeg`} class="img" alt={product.nameEn} />
	<div class="title">
		{product.nameEn}
	</div>
	{product.releaseDate}
</div>

<style lang="scss">
	.root {
		display: flex;
		height: 128px;
		margin-bottom: 8px;
	}

	.img {
		height: 100%;
	}

	.title {
		font-weight: 900;
	}
</style>
