<script lang="ts">
	import { type Product } from '$lib/types';
	import { translateBrand, translateSeries } from '$lib/translate';
	export let product: Product;

	const brandInfo = translateBrand(product.brand);
	const seriesInfo = translateSeries(product.series);
</script>

<div class="root">
	<div class="left">
		<img src={`/images/boxarts/${product.id}.jpeg`} class="img" alt={product.nameEn} />
	</div>
	<div class="right">
		<div class="title">
			<a href={`https://manual.bandai-hobby.net/menus/detail/${product.id}`} target="_blank">
				{product.nameEn}
			</a>
			<span class="jp">
				{product.nameJp}
			</span>
		</div>

		<div class="releaseDate">
			{product.releaseDate}
		</div>

		<div class="info">
			<div class="brand">
				<img
					src={`/images/categories/${brandInfo.imageIndex}.jpeg`}
					alt={brandInfo.nameEn}
					title={brandInfo.nameEn}
				/>
			</div>
			<div class="series">
				<img
					src={`/images/titles/${seriesInfo.imageIndex}.jpeg`}
					alt={seriesInfo.nameEn}
					title={seriesInfo.nameEn}
				/>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.root {
		display: flex;
		height: 128px;
		padding: 0 16px;
		border-bottom: 1px solid var(--border-color);
	}

	.left {
		width: 128px;
		height: 128px;
		flex: 0 0 auto;
	}

	.right {
		display: flex;
		align-items: center;
		justify-content: stretch;
		margin: 0 8px;
		flex: 1 1 auto;
		gap: 8px;
	}

	.img {
		height: 100%;
	}

	.title {
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;

		a {
			color: unset;
			text-decoration: none;
			font-weight: 900;

			&:hover {
				text-decoration: underline;
			}
		}

		.jp {
			font-size: 80%;
		}
	}

	.releaseDate {
		flex: 0 0 auto;
		margin-right: 8px;
		width: 100px;
	}

	.info {
		display: contents;
	}

	.brand,
	.series {
		flex: 0 0 auto;
		img {
			width: 72px;
		}
	}
</style>
