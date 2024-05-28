<script lang="ts">
	let {
		count = 0,
		onClear,
		children
	}: {
		count?: number;
		onClear?: () => void;
		children: () => any;
	} = $props();
</script>

<div class="title">
	<span class="title-text">{@render children()}</span>
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
			display: flex;
			align-items: center;
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
