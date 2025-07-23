<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { cardCategoryState, fetchStatus } from '../app/stores';
	import { getCategories, createCategory } from '../hooks/categories';
	import Button from './Button.svelte';
	import Select from './Select.svelte';
	import CategoryCreate from './CategoryCreate.svelte';
	import { Input, Span } from 'flowbite-svelte';
	import { AngleDownOutline } from 'flowbite-svelte-icons';

	export let selectedCategory: string | null = null;
	let isOpen = false;
	const dispatch = createEventDispatcher();

	onMount(async () => {
		await getCategories();
	});

	function selectCategory(categoryId: string) {
		selectedCategory = categoryId;
		dispatch('change', { category: categoryId });
	}

	function getCategoryName(categoryId: string) {
		if (!$cardCategoryState.data) return '';
		const category = $cardCategoryState.data.find((cat: any) => cat.id === categoryId);
		return category?.name || '';
	}
</script>

{#if $cardCategoryState.status === fetchStatus.loading}
	<div class="">Loading categories...</div>
{:else if $cardCategoryState.status === fetchStatus.error}
	<div class="">Error loading categories</div>
{:else if $cardCategoryState.data && $cardCategoryState.data.length > 0}
	<Button className="whitespace-nowrap"
		>{selectedCategory ? getCategoryName(selectedCategory) : 'Category'}<AngleDownOutline
			class="me-2 h-4 w-4"
		/></Button
	>
	<Select
		{isOpen}
		simple
		items={[
			...$cardCategoryState.data.map((category) => ({
				text: category.name,
				action: () => {
					selectCategory(category.id);
				}
			})),
			{
				component: { component: CategoryCreate, props: {}, text: '' }
			}
		]}
	/>
{/if}
