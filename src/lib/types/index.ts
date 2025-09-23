export interface Card {
	body: string;
	card: string;
	category: string;
	collectionId: string;
	collectionName: string;
	id: number;
	priority: number;
	project: string;
	status: string;
	title: string;
}
export interface CardListPrettyColumn {
	position: number;
	isActive: boolean;
	cards: Card[];
	isTerminal: boolean;
}
