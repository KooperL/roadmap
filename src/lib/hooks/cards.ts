import { cards, fetchStatus } from "../app/stores";
import { logger } from "../logger";
import { pb } from "../pocketbase";

export const getCards = async (projectId: string) => {
	try {
		logger.info('getTenants hook', 'Hook called');
		cards.update((state) => ({
			status: 'loading',
			errorMessage: undefined,
			data: undefined
		}));
		const pbTenants = await pb.collection('cards').getList(1, 50, {
			// filter: 'project = "projectId"',
			expand: 'tenant'
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

export const getCard = async (cardId: string) => {
	try {
		logger.info('getTenants hook', 'Hook called');
		cards.update((state) => ({
			status: 'loading',
			errorMessage: undefined,
			data: undefined
		}));
		const pbTenants = await pb.collection('cards').getList(1, 50, {
			// filter: 'id = "cardId"',
			expand: 'comments'
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

export const newCard = async (details: any) => {
	try {
		logger.info('getTenants hook', 'Hook called');
		cards.update((state) => ({
			status: 'loading',
			errorMessage: undefined,
			data: undefined
		}));
		const pbTenants = await pb.collection('cards').create({
            
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