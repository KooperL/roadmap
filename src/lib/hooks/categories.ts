import { categoryStore, fetchStatus } from "../app/stores";
import { logger } from "../logger";
import { pb } from "../pocketbase";

export const getCategories = async () => {
	try {
		logger.info('getCategories hook', 'Hook called');
		categoryStore.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const fetchCategoriesResult = await pb.collection('category').getFullList({
			sort: 'name'
		});
		categoryStore.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: fetchCategoriesResult
		}));
		logger.debug('getCategories hook', 'Categories fetched');
	} catch (e: any) {
		logger.error('getCategories hook', e.message);
		categoryStore.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
}

export const createCategory = async (name: string) => {
	try {
		logger.info('createCategory hook', 'Hook called');
		categoryStore.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const createCategoryResult = await pb.collection('category').create({
			name: name
		});
		categoryStore.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: createCategoryResult
		}));
		logger.debug('createCategory hook', 'Category created');
		return createCategoryResult;
	} catch (e: any) {
		logger.error('createCategory hook', e.message);
		categoryStore.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
		throw e;
	}
} 