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

	let isOpen = $state(true);
</script>

<div class:root={true} class:isOpen>
	<SidebarTitle
		count={enabledItems.length}
		onClear={() => {
			enabledItems = [];
		}}
	>
		<button
			onclick={() => {
				isOpen = !isOpen;
			}}
			class="collapse"
		>
			{#if isOpen}
				▼
			{:else}
				▶
			{/if}
		</button>
		{title}
	</SidebarTitle>
	{#if isOpen}
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
	{/if}
</div>

<style lang="scss">
	.root {
		border-bottom: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		flex: 0 0 auto;
		overflow: hidden;

		&.isOpen {
			flex: 1 1;
		}
	}

	.items {
		overflow: auto;
		flex: 1 1;
	}

	.collapse {
		border: 0;
		background: 0;
		padding: 0;
		width: 18px;
		font-size: 70%;
		text-align: left;
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
