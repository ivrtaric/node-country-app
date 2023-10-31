import express from 'express';
import env from 'src/env';
import { router } from 'src/api/routes';
import { errorHandler } from 'src/api/middleware/error-handler';
import { getWorkerPool } from 'src/application/calculations/worker-pool';
import { getClient } from 'src/db';
import { Logger } from 'src/util/logger';

const logger = new Logger('app');

export const start = () => {
	getClient();
	getWorkerPool();

	const app = express();
	app.use(env.BASE_PATH, router);
	app.use(errorHandler);

	const server = app.listen(env.PORT, async () => {
		logger.log(`Server is running at http://localhost:${env.PORT}${env.BASE_PATH}`);
	});

	return { app, server };
};
