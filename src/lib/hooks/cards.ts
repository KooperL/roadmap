import { card, cardCreate, cards, cardUpdate, commentCreate, fetchStatus } from "../app/stores";
import { logger } from "../logger";
import { pb } from "../pocketbase";

export const getCards = async (projectId: string) => {
	try {
		logger.info('getCards hook', 'Hook called');
		cards.update((state) => ({
			status: 'loading',
			errorMessage: undefined,
			data: undefined
		}));
		const cardsResult = await pb.collection('card').getList(1, 50, {
			// filter: 'project = "projectId"'
		});
		cards.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: cardsResult.items
		}));
		logger.debug('getCards hook', 'Cards fetched');
	} catch (e: any) {
		logger.error('getCards hook', e.message);
		cards.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
}

export const getCard = async (cardId: string) => {
	try {
		logger.info('getCard hook', 'Hook called');
		card.update((state) => ({
			status: 'loading',
			errorMessage: undefined,
			data: undefined
		}));
		const cardResult = await pb.collection('card').getOne(cardId, {
			expand: `comment_via_card`,
		});
		card.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: cardResult
		}));
		logger.debug('getCard hook', 'Card fetched');
	} catch (e: any) {
		logger.error('getCard hook', e.message);
		card.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
}

export const newCard = async (details: any) => {
	try {
		logger.info('newCard hook', 'Hook called');
		cardCreate.update((state) => ({
			status: 'loading',
			errorMessage: undefined,
			data: undefined
		}));
		const newCardResult = await pb.collection('card').create({
            title: details.title,
			body: details.body,
			status: details.status,
        });
		cardCreate.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: newCardResult.items
		}));
		logger.debug('newCard hook', 'Card created');
	} catch (e: any) {
		logger.error('newCard hook', e.message);
		cards.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
}


export const updateCard = async (id: string, details: any) => {
	try {
		logger.info('updateCard hook', 'Hook called');
		cardUpdate.update((state) => ({
			status: 'loading',
			errorMessage: undefined,
			data: undefined
		}));
		const updatedCardResult = await pb.collection('card').update(id, {
			title: details.title,
            body: details.body,
			status: details.status,
        });
		cardUpdate.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: updatedCardResult.items
		}));
		logger.debug('updateCard hook', 'Card updated');
	} catch (e: any) {
		logger.error('updateCard hook', e.message);
		cardUpdate.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
}

export const deleteCard = async (id: string) => {
	try {
		logger.info('deleteCard hook', 'Hook called');
		cards.update((state) => ({
			status: 'loading',
			errorMessage: undefined,
			data: undefined
		}));
		const cardDeleteResult = await pb.collection('card').delete(id);
		cards.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: cardDeleteResult
		}));
		logger.debug('deleteCard hook', 'Tenants fetched');
	} catch (e: any) {
		logger.error('deleteCard hook', e.message);
		cards.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
}

export const cardComment = async (cardId: string, comment: string) => {
	try {
		logger.info('cardComment hook', 'Hook called');
		commentCreate.update((state) => ({
			status: 'loading',
			errorMessage: undefined,
			data: undefined
		}));
		const commentCreateResponse = await pb.collection('comment').create({
			card: cardId,
			body: comment
		});
		commentCreate.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: commentCreateResponse.items
		}));
		logger.debug('cardComment hook', 'Tenants fetched');
	} catch (e: any) {
		logger.error('cardComment hook', e.message);
		commentCreate.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
}
