<script lang="ts">
	let {
		title,
		count = 0,
		onClear
	}: {
		title: string;
		count?: number;
		onClear?: () => void;
	} = $props();
</script>

<div class="title">
	<span class="title-text">
		{title}
	</span>
	{#if count != null && count > 0}
		<span class="title-count">&nbsp;({count})</span>
		{#if onClear}
			<button onclick={onClear}>Clear all</button>
		{/if}
	{/if}
</div>

<style lang="scss">
	.title {
		display: flex;
		align-items: center;
		padding: 8px 16px;

		.title-text {
			font-weight: 900;
		}

		button {
			margin-left: auto;
			background: none;
			border: none;
			cursor: pointer;
			font-size: 80%;
		}
	}
</style>
