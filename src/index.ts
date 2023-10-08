import 'app-module-path/cwd';
import express from 'express';

import { router } from 'src/routes';
import { Logger } from 'src/util/logger';

import env from './env';
import { getClient } from 'src/db/connect';
import { errorHandler } from 'src/middleware/error-handler';

const logger = new Logger('app');

const app = express();
app.use(env.BASE_PATH, router);
app.use(errorHandler);
const server = app.listen(env.PORT, async () => {
	logger.log(`Server is running at http://localhost:${env.PORT}${env.BASE_PATH}`);
});

process.on('SIGTERM', async () => {
	logger.log(`SIGTERM received`);
	await gracefulShutdown();
});
process.on('SIGINT', async () => {
	logger.log(`SIGINT received`);
	await gracefulShutdown();
});

async function gracefulShutdown() {
	const dbClient = await getClient();
	await dbClient
		.disconnect()
		.then(() => logger.log('Database disconnected'))
		.then(() => server.close(() => logger.log(`Server closed`)))
		.then(() => process.exit());
}
