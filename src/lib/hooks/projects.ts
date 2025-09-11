import {
	cardsState,
	createProjectState,
	fetchStatus,
	projectsState,
	workflowState
} from '../app/stores';
import { logger } from '../logger';
import { pb } from '../pocketbase';

export const getProjects = async () => {
	try {
		logger.info('getProjects hook', 'Hook called');
		projectsState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const pbTenants = await pb
			.collection('project')
			.getFullList({ expand: 'workflow, workflow.statuses, workflow.categories' });
		projectsState.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: pbTenants
		}));
		logger.debug('getProjects hook', 'Projects fetched');
	} catch (e: any) {
		logger.error('getProjects hook', e.message);
		projectsState.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
};

export const resetGetProjects = () => {
	logger.info('resetGetProjects hook', 'Hook called');
	projectsState.update((state) => ({
		status: fetchStatus.idle,
		errorMessage: undefined,
		data: undefined
	}));
};

export const createProject = async (name: string, workflowId: string) => {
	try {
		logger.info('createProject hook', 'Hook called');
		createProjectState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const createProjectResult = await pb.collection('project').create({
			name: name,
			workflow: workflowId
		});
		createProjectState.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: createProjectResult
		}));
		logger.debug('createProject hook', 'Project created');
		return createProjectResult;
	} catch (e: any) {
		logger.error('createProject hook', e.message);
		createProjectState.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
};

export const resetCreateProject = () => {
	logger.info('resetCreateProject hook', 'Hook called');
	createProjectState.update((state) => ({
		status: fetchStatus.idle,
		errorMessage: undefined,
		data: undefined
	}));
};

export const getWorkflows = async () => {
	try {
		logger.info('getWorkflows hook', 'Hook called');
		workflowState.update((state) => ({
			status: fetchStatus.loading,
			errorMessage: undefined,
			data: undefined
		}));
		const pbTenants = await pb
			.collection('workflow')
			.getFullList({ expand: 'statuses,categories' });
		workflowState.update((state) => ({
			errorMessage: undefined,
			status: fetchStatus.success,
			data: pbTenants.map((workflow) => ({
				id: workflow.id,
				name: workflow.name,
				statuses: workflow?.expand?.statuses,
				categories: workflow?.expand?.categories
			}))
		}));
		logger.debug('getWorkflows hook', 'Workflows fetched');
	} catch (e: any) {
		logger.error('getWorkflows hook', e.message);
		workflowState.update((state) => ({
			status: fetchStatus.error,
			data: undefined,
			errorMessage: e.message
		}));
	}
};

export const resetGetWorkflows = () => {
	logger.info('resetGetWorkflows hook', 'Hook called');
	workflowState.update((state) => ({
		status: fetchStatus.idle,
		errorMessage: undefined,
		data: undefined
	}));
};
