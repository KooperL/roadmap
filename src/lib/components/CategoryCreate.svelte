<script>
	import { cardCategoryState, fetchStatus } from '../app/stores';
	import { createCategory, getCategories } from '$lib/hooks/categories';
	import { onMount } from 'svelte';
	import { Input, Button } from 'flowbite-svelte';
	import ButtonAlt from './Button.svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';

	onMount(async () => {
		if ($cardCategoryState.status === fetchStatus.idle) {
			await getCategories();
		}
	});

	let newCategoryName = '';

	async function createNewCategory() {
		if (newCategoryName.trim()) {
			try {
				const newCategory = await createCategory(newCategoryName.trim());
				await getCategories();
				newCategoryName = '';
			} catch (error) {
				console.error('Failed to create category:', error);
			}
		}
	}
</script>

<div class="">
	<div class="">Create new category:</div>
	<div class="flex">
		<Input bind:value={newCategoryName} placeholder="Category name..." class="" />
		<ButtonAlt click={createNewCategory} disabled={!newCategoryName.trim()}>
			<PlusOutline class="me-2 h-4 w-4" />
		</ButtonAlt>
	</div>
</div>
