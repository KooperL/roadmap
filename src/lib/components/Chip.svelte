<script>
	import { Badge } from 'flowbite-svelte';
	export let className = '';
</script>

<Badge {...$$restProps} class={className}>
	<slot />
</Badge>
