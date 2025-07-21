<script>
import { Button } from 'flowbite-svelte'
export let className = ""
</script>

<Button
  {...$$restProps}
  class={className}
>
  <slot />
</Button>
