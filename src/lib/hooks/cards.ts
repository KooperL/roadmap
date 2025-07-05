import { cardCreate, cards, cardUpdate, fetchStatus } from "../app/stores";
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
		cards.update((state) => ({
			status: 'loading',
			errorMessage: undefined,
			data: undefined
		}));
		const cardResult = await pb.collection('card').getList(1, 50, {
			// filter: 'id = "cardId"',
			expand: 'comment'
		});
		cards.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: cardResult.items
		}));
		logger.debug('getCard hook', 'Card fetched');
	} catch (e: any) {
		logger.error('getCard hook', e.message);
		cards.update((state) => ({
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
		const newCardResult = await pb.collection('cards').create({
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
		const updatedCardResult = await pb.collection('cards').update(id, {
			title: details.title,
            body: details.body,
			status: details.status,
        });
		updatedCardResult.update((state) => ({
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
		const cardDeleteResult = await pb.collection('cards').delete(id);
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
		logger.info('getTenants hook', 'Hook called');
		cards.update((state) => ({
			status: 'loading',
			errorMessage: undefined,
			data: undefined
		}));
		const pbTenants = await pb.collection('comment').create({
			card: cardId,
			body: comment
		});
		cards.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: pbTenants.items
		}));
		logger.debug('getTenants hook', 'Tenants fetched');
	} catch (e: any) {
		logger.error('getTenants hook', e.message);
		cards.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
}