<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { cardPriority } from '../config';
	import Chip from './Chip.svelte';
  import Select from './Select.svelte'
  import Button from './Button.svelte'
	import { AngleDownOutline } from 'flowbite-svelte-icons';
  import { writable } from 'svelte/store';

  export let selectedPriority: number = cardPriority.MEDIUM;
  const dispatch = createEventDispatcher();

  function selectPriority(priorityValue: number) {
    selectedPriority = priorityValue;
    dispatch('change', { priority: priorityValue });
  }

  function getPriorityName(priorityValue: number): string {
    const entries = Object.entries(cardPriority);
    const entry = entries.find(([key, value]) => value === priorityValue);
    return entry ? entry[0] : 'MEDIUM';
  }

  function getPriorityColor(priorityValue: number): string {
    switch (priorityValue) {
      case cardPriority.CRITICAL:
        return 'red';
      case cardPriority.HIGH:
        return 'yellow';
      case cardPriority.MEDIUM:
      case cardPriority.LOW:
      default:
        return 'indigo';
    }
  }

</script>

<Button className="whitespace-nowrap">{selectedPriority ? getPriorityName(selectedPriority) : 'Priority'} <AngleDownOutline class="me-2 h-4 w-4" /></Button>
<Select simple items={Object.keys(cardPriority).map(key => ({
    component: {component: Chip, props: {color: getPriorityColor(cardPriority[key])}, text: key},
    action: () => selectPriority(cardPriority[key])
}))
}/>
