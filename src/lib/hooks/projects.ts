import { cards, fetchStatus, projects } from '../app/stores';
import { logger } from '../logger';
import { pb } from '../pocketbase';

export const getProjects = async () => {
	try {
		logger.info('getTenants hook', 'Hook called');
		projects.update((state) => ({
			status: 'loading',
			errorMessage: undefined,
			data: undefined
		}));
		const pbTenants = await pb.collection('projects').getList(1, 50, {});
		projects.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: pbTenants.items
		}));
		logger.debug('getTenants hook', 'Tenants fetched');
	} catch (e: any) {
		logger.error('getTenants hook', e.message);
		projects.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
};

export const newProject = async () => {
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
};
