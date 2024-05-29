<script lang="ts">
	import { type Product } from '$lib/types';
	import { translateBrand, translateSeries } from '$lib/categories';
	let {
		product,
		onBrandClick,
		onSeriesClick
	}: {
		product: Product;
		onBrandClick: (brand: string) => void;
		onSeriesClick: (brand: string) => void;
	} = $props();

	const brandInfo = translateBrand(product.brand);
	const seriesInfo = translateSeries(product.series);
</script>

<div class="root">
	<div class="left">
		<a href={`/images/boxarts/${product.id}.jpeg`} target="_blank">
			<img src={`/images/boxarts/${product.id}.jpeg`} class="img" alt={product.nameEn} />
		</a>
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
				<button onclick={() => onBrandClick(brandInfo.nameJp)}>
					<img
						src={`/images/categories/${brandInfo.imageIndex}.jpeg`}
						alt={brandInfo.nameEn}
						title={brandInfo.nameEn}
					/>
				</button>
			</div>
			<div class="series">
				<button onclick={() => onSeriesClick(seriesInfo.nameJp)}>
					<img
						src={`/images/titles/${seriesInfo.imageIndex}.jpeg`}
						alt={seriesInfo.nameEn}
						title={seriesInfo.nameEn}
					/>
				</button>
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
		margin: 0 16px;
		flex: 1 1 auto;
		gap: 16px;
	}

	.img {
		height: 100%;
	}

	.title {
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
		align-items: start;

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
		flex: 0 0 120px;
		font-feature-settings: 'tnum';
		font-size: 80%;
		white-space: nowrap;
	}

	.info {
		display: contents;
	}

	.brand,
	.series {
		flex: 0 0 auto;
		button {
			cursor: pointer;
			background: none;
			border: none;
			padding: 0;
			margin: 0;
		}
		img {
			width: 72px;
		}
	}
</style>
