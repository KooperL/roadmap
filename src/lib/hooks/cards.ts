import { cardsState, cardState, commentCreateState, createCardState, deleteCardState, fetchCreateTagState, fetchStatus, updateCardState } from "../app/stores";
import { logger } from "../logger";
import { pb } from "../pocketbase";

export const getCards = async (projectId: string) => {
	try {
		logger.info('getCards hook', 'Hook called');
		cardsState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const fetchCardsResult = await pb.collection('card').getList(1, 50, {
			expand: 'category',
			// filter: 'project = "projectId"'
		});
		cardsState.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: fetchCardsResult.items
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
}

export const getCard = async (cardId: string) => {
	try {
		logger.info('getCard hook', 'Hook called');
		cardState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const fetchCardResult = await pb.collection('card').getOne(cardId, {
			expand: ['comment_via_card', 'tags', 'category'].join(','),
		});
		cardState.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: fetchCardResult
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
}

export const fetchCreateTags = async (projectId: string, tags: string[]) => {
	try {
		logger.info('fetchCreateTags hook', 'Hook called');
		fetchCreateTagState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
    let initialFetch = []
    if (!tags.length) {
		  initialFetch = await pb.collection('tags').getFullList({
		  	filter: tags.map((tag) => `name="${tag}"`).join('||')
		  	// filter: 'project = "projectId"'
      });
    }
    const initialFetchTags = initialFetch.map(record => record.name)
    const missingTags = tags.filter(tagString => {
      return !initialFetchTags.includes(tagString)
    })
    let createdTags = []
    for (let i = 0; i < missingTags.length; i++) {
      const missingTag = missingTags[i]
      const createMissingTag = await pb.collection('tags').create({
        // projectId: projectId,
        name: missingTag
      })
      createdTags.push(createMissingTag)
    }
		fetchCreateTagState.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: [...initialFetch, ...createdTags]
		}));
		logger.debug('fetchCreateTags hook', 'Tag IDs fetched');
	} catch (e: any) {
		logger.error('fetchCreateTags hook', e.message);
		fetchCreateTagState.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
}

export const createCard = async (details: any) => {
	try {
		logger.info('createCard hook', 'Hook called');
		createCardState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const putCardResult = await pb.collection('card').create({
      title: details.title,
			body: details.body,
			status: details.status,
      tags: details.tags,
      category: details.category
    });
		createCardState.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: putCardResult.items
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
}


export const updateCard = async (id: string, details: any) => {
	try {
		logger.info('updateCard hook', 'Hook called');
		updateCardState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const updatedCardResult = await pb.collection('card').update(id, {
			title: details.title,
      body: details.body,
			status: details.status,
      tags: details.tags,
      category: details.category
    });
		updateCardState.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: updatedCardResult.items
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
}

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
}

export const cardComment = async (cardId: string, comment: string) => {
	try {
		logger.info('cardComment hook', 'Hook called');
		commentCreateState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const commentCreateResult = await pb.collection('comment').create({
			card: cardId,
			body: comment
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
}
