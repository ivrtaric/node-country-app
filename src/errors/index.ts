export class NotFoundError extends Error {
	constructor(itemType: string, data: Record<string, unknown>) {
		super(`Not found: ${itemType} ${JSON.stringify(data)}`);
	}
}
