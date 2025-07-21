<script>
import { Select, Dropdown, DropdownItem } from 'flowbite-svelte'
export let className = ""
export let items = [];
</script>

<Dropdown
  {...$$restProps}
  class={className}
>
  {#each items as item}
    <DropdownItem on:click={item?.action}>{item?.text ? item.text : ''}
      {#if item?.component}
<svelte:component this={item.component.component} {...item.component.props}>{item.component.text} </svelte:component>
{/if}
</DropdownItem>
  {/each}
</Dropdown>
