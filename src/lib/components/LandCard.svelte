<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { updateCard } from '../hooks/cards';
	import { cardPriority } from '../config';
	import { Card } from 'flowbite-svelte';

	export let card: any;
	export let currentStatus: string;

	const dispatch = createEventDispatcher();

	let isDragging = false;
	let dragOffset = { x: 0, y: 0 };

	function handleDragStart(event: DragEvent) {
		if (!event.dataTransfer) return;

		isDragging = true;
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text/plain', card.id);

		// Calculate offset from mouse to card element
		const rect = (event.target as HTMLElement).getBoundingClientRect();
		dragOffset.x = event.clientX - rect.left;
		dragOffset.y = event.clientY - rect.top;

		// Set drag image with offset
		const dragImage = event.target as HTMLElement;
		if (dragImage) {
			event.dataTransfer.setDragImage(dragImage, dragOffset.x, dragOffset.y);
		}

		// Dispatch drag start event
		dispatch('dragstart', { cardId: card.card, status: currentStatus });
	}

	function handleDragEnd() {
		isDragging = false;
		dispatch('dragend', { cardId: card.card });
	}

	function handleClick() {
		if (!isDragging) {
			dispatch('open', { cardId: card.card });
		}
	}

	function getPriorityName(priorityValue: number): string {
		const entries = Object.entries(cardPriority);
		const entry = entries.find(([key, value]) => value === priorityValue);
		return entry ? entry[0] : 'MEDIUM';
	}

	function getPriorityColor(priorityValue: number): string {
		switch (priorityValue) {
			case cardPriority.CRITICAL:
				return 'text-red-700 bg-red-100 border-red-200';
			case cardPriority.HIGH:
				return 'text-orange-700 bg-orange-100 border-orange-200';
			case cardPriority.MEDIUM:
				return 'text-yellow-700 bg-yellow-100 border-yellow-200';
			case cardPriority.LOW:
				return 'text-green-700 bg-green-100 border-green-200';
			default:
				return 'text-gray-700 bg-gray-100 border-gray-200';
		}
	}
</script>

<div
	draggable="true"
	on:dragstart={handleDragStart}
	on:dragend={handleDragEnd}
	on:click={handleClick}
>
	<Card>
		<div class="">
			<div class="">
				{card.category}
				<span
					class="rounded-full border px-2 py-0.5 text-xs font-semibold shadow-sm {getPriorityColor(
						card.priority
					)}"
				>
					{getPriorityName(card.priority)}
				</span>
			</div>
			<strong class="">{card.title}</strong>
		</div>
		<div class="">{card.body}</div>
		<div class="">
			<span class="">{currentStatus}</span>
		</div>

		<!-- Drag indicator -->
		<div class="hidden hover:inline">
			<div class="">Drag to move</div>
		</div>
	</Card>
</div>
