<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { projectStatusState, fetchStatus } from '../app/stores';
  import { getProjectStatus } from '../hooks/cards';
	import Chip from './Chip.svelte';
  import Select from './Select.svelte'
  import Button from './Button.svelte'
	import { AngleDownOutline } from 'flowbite-svelte-icons';

  export let selectedStatus: string = '';
  let isOpen = false
  const dispatch = createEventDispatcher();

  onMount(async () => {
    await getProjectStatus('');
  });

  function selectStatus(statusName: string) {
    selectedStatus = statusName;
    isOpen = false
    dispatch('change', { status: statusName });
  }

</script>


{#if $projectStatusState.status === fetchStatus.loading}
{:else if $projectStatusState.status === fetchStatus.success}
<Button className="whitespace-nowrap">{selectedStatus ? selectedStatus : 'Status'}<AngleDownOutline class="me-2 h-4 w-4" /></Button>
<Select isOpen simple items={$projectStatusState.data.map(statusObject => ({
    component: {component: Chip, props: {color: ''}, text: statusObject.name},
    action: () => selectStatus(statusObject.name)
}))
}/>
{/if}
