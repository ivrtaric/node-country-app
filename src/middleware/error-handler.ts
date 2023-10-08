import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Logger } from 'src/util/logger';
import { HttpStatusError } from 'src/errors';

const logger = new Logger('error-handler');

export const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
	logger.log(error);

	response.header('Content-Type', 'application/json');

	const status = error instanceof HttpStatusError ? error.status : 500;
	response.status(status).send({ status, message: error.message });
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
