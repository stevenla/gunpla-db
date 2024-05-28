<script lang="ts" generics="T, ID">
	let {
		items,
		enabledItems = $bindable(),
		getID
	}: {
		items: T[];
		enabledItems: ID[];
		getID(item: T): ID;
	} = $props();
</script>

{#each items as item}
	<label>
		<input
			type="checkbox"
			checked={enabledItems.includes(getID(item))}
			onchange={(event) => {
				if (event.currentTarget.checked) {
					enabledItems.push(getID(item));
				} else {
					enabledItems.splice(enabledItems.indexOf(getID(item)), 1);
				}
			}}
		/>
		<slot {item}>{getID(item)}</slot>
	</label>
{/each}
