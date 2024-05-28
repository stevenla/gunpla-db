<script lang="ts">
	import { type Product } from '$lib/types';
	export let product: Product;
</script>

<div>
	<img src={`/images/boxarts/${product.id}.jpeg`} width={100} alt={product.nameEn} />
	{product.nameEn} - {product.releaseDate}
</div>
