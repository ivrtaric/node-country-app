export class HttpStatusError extends Error {
	constructor(
		public status: number,
		message: string
	) {
		super(message);
	}
}

export class NotFoundError extends HttpStatusError {
	constructor(itemType: string, data: Record<string, unknown>) {
		super(404, `Not found: ${itemType} ${JSON.stringify(data)}`);
	}
}
