<script>
	import { Select, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	export let className = '';
	let isOpen = false;
	export let items = [];
</script>

<Dropdown class={className} bind:open={isOpen} simple>
	{#each items as item}
		<DropdownItem
			on:click={item?.action
				? () => {
						isOpen = false;
						item.action();
					}
				: undefined}
			>{item?.text ? item.text : ''}
			{#if item?.component}
				<svelte:component this={item.component.component} {...item.component.props}
					>{item.component?.text ?? ''}
				</svelte:component>
			{/if}
		</DropdownItem>
	{/each}
</Dropdown>
