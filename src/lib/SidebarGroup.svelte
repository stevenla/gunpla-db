<script lang="ts" generics="T, ID">
	import without from 'lodash/without';
	import SidebarTitle from './SidebarTitle.svelte';

	let {
		items,
		enabledItems = $bindable(),
		getID,
		title
	}: {
		items: T[];
		enabledItems: ID[];
		getID(item: T): ID;
		title: string;
	} = $props();
</script>

<div class="root">
	<!-- <div class="title">
		<span class="title-text">
			{title}
		</span>
		{#if enabledItems.length > 0}
			<span class="title-count">&nbsp;({enabledItems.length})</span>
			<button
				onclick={() => {
					enabledItems = [];
				}}
			>
				Clear all
			</button>
		{/if}
	</div> -->
	<SidebarTitle
		{title}
		count={enabledItems.length}
		onClear={() => {
			enabledItems = [];
		}}
	/>
	<div class="items">
		{#each items as item}
			<label>
				<input
					type="checkbox"
					checked={enabledItems.includes(getID(item))}
					onchange={(event) => {
						if (event.currentTarget.checked) {
							enabledItems = [...enabledItems, getID(item)];
						} else {
							enabledItems = without(enabledItems, getID(item));
						}
					}}
				/>
				<div>
					<slot {item}>{getID(item)}</slot>
				</div>
			</label>
		{/each}
	</div>
</div>

<style lang="scss">
	.root {
		border-bottom: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		flex: 1 1;
		overflow: hidden;
	}

	.items {
		overflow: auto;
		flex: 1 1;
	}

	label {
		font-size: 80%;
		font-feature-settings: 'tnum';
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 0 16px;

		input + div {
			opacity: 0.6;
		}
		input:checked + div {
			opacity: 1;
		}
	}
</style>
