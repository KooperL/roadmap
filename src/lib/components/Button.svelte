<script>
	import { Button } from 'flowbite-svelte';
	export let className = '';
	export let click;
</script>

<Button on:click={click} {...$$restProps} class={className}>
	<slot />
</Button>
