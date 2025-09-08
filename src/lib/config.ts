export const site = {
	name: 'name',
	description: 'Description of the site'
};

export const cardPriority = {
	CRITICAL: 'CRITICAL',
	HIGH: 'HIGH',
	MEDIUM: 'MEDIUM',
	LOW: 'LOW'
};

export function getPriority(priorityValue: number): (string | number)[] {
	if (priorityValue >= 8) return ['black', cardPriority.CRITICAL];
	if (priorityValue >= 6) return ['red', cardPriority.HIGH];
	if (priorityValue >= 4) return ['yellow', cardPriority.MEDIUM];
	return ['indigo', cardPriority.LOW];
}
