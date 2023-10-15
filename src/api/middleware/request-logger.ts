import { NextFunction, Request, Response } from 'express';
import { Logger } from 'src/util/logger';

const logger = new Logger('http-log');

export const requestLogger = (request: Request, response: Response, next: NextFunction) => {
	logger.info(`${request.method} ${request.url} ${JSON.stringify(request.body ?? {})}`);
	next();
};
