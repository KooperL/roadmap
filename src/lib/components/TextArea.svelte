<script>
	import { Textarea } from 'flowbite-svelte';
	export let className = '';
	let { value, ...props } = $$restProps;
</script>

<Textarea bind:value {...$$restProps} class={className} />
