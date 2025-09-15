import { hashCode } from '$lib/utils';
import { get } from 'svelte/store';
import {
	cardsState,
	cardState,
	commentCreateState,
	createCardState,
	deleteCardState,
	fetchStatus,
	updateCardState
} from '../app/stores';
import { logger } from '../logger';
import { pb, currentUser } from '../pocketbase';

export const getCards = async (projectName: string) => {
	try {
		logger.info('getCards hook', 'Hook called');
		cardsState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const fetchCardsResult = await pb.collection('cardsShallow').getFullList({
			...( projectName && { filter: `project = ${projectName}` } )
		});
		cardsState.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: fetchCardsResult
		}));
		logger.debug('getCards hook', 'Cards fetched');
	} catch (e: any) {
		logger.error('getCards hook', e.message);
		cardsState.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
};

export const resetGetCards = () => {
	logger.info('resetGetCards hook', 'Hook called');
	cardsState.update((state) => ({
		status: fetchStatus.idle,
		errorMessage: undefined,
		data: undefined
	}));
};

export const getCard = async (cardId: string) => {
	try {
		logger.info('getCard hook', 'Hook called');
		cardState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const [card, title, body, category, priority, status, meta, comment] = await Promise.all([
			pb.collection('card').getOne(cardId),
			pb.collection('title_tracked').getFirstListItem(`card = "${cardId}"`, { sort: '-created' }),
			pb.collection('body_tracked').getFirstListItem(`card = "${cardId}"`, { sort: '-created' }),
			pb
				.collection('category_tracked')
				.getFirstListItem(`card = "${cardId}"`, { sort: '-created', expand: 'value' }),
			pb
				.collection('priority_tracked')
				.getFirstListItem(`card = "${cardId}"`, { sort: '-created' }),
			pb
				.collection('status_tracked')
				.getFirstListItem(`card = "${cardId}"`, { sort: '-created', expand: 'value' }),
			pb.collection('meta_tracked').getFullList({ sort: '-created', filter: `card = "${cardId}"` }),
			pb
				.collection('comment_tracked')
				.getFullList({ sort: '-created', filter: `card = "${cardId}"`, expand: 'user' })
		]);

		const tagsObj = {};
		meta.forEach((row) => {
			if (row.type === 'label') return;
			if (row.action === 'add') tagsObj[row.value] = true;
			if (row.action === 'remove') delete tagsObj[row.value];
		});

		// No duplicate comments lol someone tell stack overflow mods about this tech
		const commentsObj = {};
		comment.forEach((row) => {
			const hash = hashCode(row.value);
			if (row.action === 'add') commentsObj[hash] = row;
			if (row.action === 'remove') delete commentsObj[hash];
		});

		cardState.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: {
				id: card.id,
				created: card.created,
				project: card.project,
				title: title.value,
				body: body.value,
				category: category?.expand?.value?.name,
				priority: priority.value,
				status: status?.expand?.value?.name,
				tags: Object.keys(tagsObj),
				comments: Object.values(commentsObj)
			}
		}));
		logger.debug('getCard hook', 'Card fetched');
	} catch (e: any) {
		logger.error('getCard hook', e.message);
		cardState.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
};

export const resetGetCard = () => {
	logger.info('resetGetCard hook', 'Hook called');
	cardState.update((state) => ({
		status: fetchStatus.idle,
		errorMessage: undefined,
		data: undefined
	}));
};

export const createCard = async (details: any) => {
	try {
		logger.info('createCard hook', 'Hook called');
		createCardState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const putCardResult = await pb.collection('card').create({ project: details.project, user: get(currentUser).record?.id });

		await Promise.all([
			pb.collection('title_tracked').create({
				card: putCardResult.id,
				value: details.title,
				user: get(currentUser).record?.id
			}),
			pb.collection('body_tracked').create({
				card: putCardResult.id,
				value: details.body,
				user: get(currentUser).record?.id
			}),
			pb.collection('status_tracked').create({
				card: putCardResult.id,
				value: details.status,
				user: get(currentUser).record?.id
			}),
			pb.collection('priority_tracked').create({
				card: putCardResult.id,
				value: details.priority,
				user: get(currentUser).record?.id
			}),
			pb.collection('category_tracked').create({
				card: putCardResult.id,
				value: details.category,
				user: get(currentUser).record?.id
			}),
			...details.tags.map((tagRaw: any) => {
				const tag = typeof tagRaw === 'object' ? tagRaw.name : tagRaw;
				return pb.collection('meta_tracked').create({
					card: putCardResult.id,
					action: 'add',
					user: get(currentUser).record?.id,
					type: 'tag',
					value: tag
				});
			})
		]);

		createCardState.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: putCardResult
		}));
		logger.debug('createCard hook', 'Card created');
	} catch (e: any) {
		logger.error('createCard hook', e.message);
		createCardState.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
};

export const resetCreateCard = () => {
	logger.info('resetCreateCard hook', 'Hook called');
	createCardState.update((state) => ({
		status: fetchStatus.idle,
		errorMessage: undefined,
		data: undefined
	}));
};

export const updateCard = async (table: string, cardId: string, value: any, action = 'add') => {
	try {
		logger.info('updateCard hook', 'Hook called');
		updateCardState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const updatedCardResult = await pb.collection(table).create({
			card: cardId,
			action: action,
			...(table === 'meta_tracked' && { type: 'tag' }),
			value: value,
			user: get(currentUser).record?.id
		});
		updateCardState.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: undefined
		}));
		logger.debug('updateCard hook', 'Card updated');
	} catch (e: any) {
		logger.error('updateCard hook', e.message);
		updateCardState.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
};

export const resetUpdateCard = () => {
	logger.info('resetUpdateCard hook', 'Hook called');
	updateCardState.update((state) => ({
		status: fetchStatus.idle,
		errorMessage: undefined,
		data: undefined
	}));
};

export const deleteCard = async (id: string) => {
	try {
		logger.info('deleteCard hook', 'Hook called');
		deleteCardState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const cardDeleteResult = await pb.collection('card').delete(id);
		deleteCardState.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: cardDeleteResult
		}));
		logger.debug('deleteCard hook', 'Tenants fetched');
	} catch (e: any) {
		logger.error('deleteCard hook', e.message);
		deleteCardState.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
};

export const resetDeleteCard = () => {
	logger.info('resetDeleteCard hook', 'Hook called');
	deleteCardState.update((state) => ({
		status: fetchStatus.idle,
		errorMessage: undefined,
		data: undefined
	}));
};

export const cardComment = async (cardId: string, comment: string, action = 'add') => {
	try {
		logger.info('cardComment hook', 'Hook called');
		commentCreateState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const commentCreateResult = await pb.collection('comment_tracked').create({
			card: cardId,
			value: comment,
			user: get(currentUser).record?.id,
			action
		});
		commentCreateState.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: commentCreateResult.items
		}));
		logger.debug('cardComment hook', 'Tenants fetched');
	} catch (e: any) {
		logger.error('cardComment hook', e.message);
		commentCreateState.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
};

export const resetCardComment = () => {
	logger.info('resetCardComment hook', 'Hook called');
	commentCreateState.update((state) => ({
		status: fetchStatus.idle,
		errorMessage: undefined,
		data: undefined
	}));
};
