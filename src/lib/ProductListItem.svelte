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
		<div class="meta">
			<div class="title">
				<a href={`https://manual.bandai-hobby.net/menus/detail/${product.id}`} target="_blank">
					{product.nameEn || product.nameJp}
				</a>
				<span class="jp">
					{product.nameJp}
				</span>
			</div>

			<div class="releaseDate">
				{product.releaseDate}
			</div>
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
		min-height: 128px;
		height: auto;
		padding: 0 16px;
		border-bottom: 1px solid var(--border-color);
		align-items: center;
		container: product / inline-size;
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

	.meta {
		display: contents;
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
	@container product (width < 480px) {
		.left {
			width: 72px;
			height: 72px;
		}
		.right {
			margin: 16px 0 16px 16px;
			flex-direction: row;
			align-items: stretch;
			justify-content: center;
			gap: 4px;
		}
		.releaseDate {
			flex-basis: auto;
			margin-top: 2px;
			&:before {
				content: '⬒';
				margin-right: 2px;
			}
		}
		.meta {
			display: flex;
			flex-direction: column;
		}
		.info {
			margin-left: auto;
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 0 0 auto;
		}
		:is(.brand, .series) img {
			width: 48px;
		}
	}
</style>
