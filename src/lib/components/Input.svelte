<script>
	import { Input } from 'flowbite-svelte';
	export let className = '';
</script>

<Input {...$$restProps} class={className} />
