import { get } from 'svelte/store';
import { cardCategoryState, fetchStatus } from '../app/stores';
import { logger } from '../logger';
import { currentUser, pb } from '../pocketbase';

export const getCategories = async () => {
	try {
		logger.info('getCategories hook', 'Hook called');
		cardCategoryState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const fetchCategoriesResult = await pb.collection('category').getFullList();
		cardCategoryState.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: fetchCategoriesResult
		}));
		logger.debug('getCategories hook', 'Categories fetched');
	} catch (e: any) {
		logger.error('getCategories hook', e.message);
		cardCategoryState.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
};

export const resetGetCategories = () => {
	logger.info('resetGetCategories hook', 'Hook called');
	cardCategoryState.update((state) => ({
		status: fetchStatus.idle,
		errorMessage: undefined,
		data: undefined
	}));
};

export const createCategory = async (name: string) => {
	try {
		logger.info('createCategory hook', 'Hook called');
		cardCategoryState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const createCategoryResult = await pb.collection('category').create({
			name: name,
			user: get(currentUser).record?.id
		});
		cardCategoryState.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: createCategoryResult
		}));
		logger.debug('createCategory hook', 'Category created');
		return createCategoryResult;
	} catch (e: any) {
		logger.error('createCategory hook', e.message);
		cardCategoryState.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
		throw e;
	}
};

export const resetCreateCategory = () => {
	logger.info('resetCreateCategory hook', 'Hook called');
	cardCategoryState.update((state) => ({
		status: fetchStatus.idle,
		errorMessage: undefined,
		data: undefined
	}));
};
