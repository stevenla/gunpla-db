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
	const uid = $props.id();
	const buttonId = `${uid}-btn`;
	const listId = `${uid}-list`;
</script>

<div class:root={true} class:isOpen>
	<SidebarTitle
		count={enabledItems.length}
		onClear={() => {
			enabledItems = [];
		}}
	>
		<button
			id={buttonId}
			onclick={() => {
				isOpen = !isOpen;
			}}
			class="collapse"
			aria-controls={listId}
			aria-expanded={isOpen}
		>
			{#if isOpen}
				▼
			{:else}
				▶
			{/if}
		</button>
		<label for={buttonId}>
			{title}
		</label>
	</SidebarTitle>
	{#if isOpen}
		<div id={listId} class="items" aria-expanded={isOpen}>
			{#each items as item}
				<label class="item">
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
		background-color: var(--background-color);
		border-bottom: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		overflow: hidden;

		&.isOpen {
			flex: 1 1 auto;
		}
	}

	.items {
		overflow: auto;
		flex: 1 1 320px;
		max-height: max-content;
		display: flex;
		flex-direction: column;
	}

	.collapse {
		color: var(--text--color);
		border: 0;
		background: 0;
		padding: 0;
		width: 18px;
		font-size: 70%;
		text-align: left;
	}

	.item {
		font-size: 80%;
		font-feature-settings: 'tnum';
		display: flex;
		align-items: start;
		gap: 4px;
		padding: 0 16px;

		input {
			margin-top: 3px;
		}

		input + div {
			color: #888;
		}
		input:checked + div {
			color: unset;
		}
	}
</style>
