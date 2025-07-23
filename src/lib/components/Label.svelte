<script>
	import { Label } from 'flowbite-svelte';
	export let className = '';
</script>

<Label {...$$restProps} class={className}>
	<slot />
</Label>
