import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';

import { Logger } from 'src/util/logger';
import { HttpStatusError } from 'src/errors';

const logger = new Logger('error-handler');

export const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
	response.header('Content-Type', 'application/json');

	if (error instanceof ZodError) {
		const status = 400; // Validation error = Bad request
		response.status(status).send({ status, message: error.issues.map(i => i.message) });
	} else {
		const status = error instanceof HttpStatusError ? error.status : 500;
		response.status(status).send({ status, message: [error.message] });
	}
};

export const handleErrorsWrapper =
	(handler: RequestHandler): RequestHandler =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await handler(req, res, next);
		} catch (e) {
			next(e);
		}
	};
