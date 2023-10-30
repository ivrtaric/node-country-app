import env from 'src/env';
import { Pool } from 'pg';
import { initializeDatabaseTypeConverters } from './types';

import { Logger } from 'src/util/logger';

const logger = new Logger('db-connect');

export const connectPool = async () => {
	logger.info(`Creating database connection pool (${env.DB_POOL_SIZE} connections) ...`);
	initializeDatabaseTypeConverters();
	return new Pool({
		max: env.DB_POOL_SIZE,
		...(await getConnectionDetails())
	});
};

const getConnectionDetails = async () => {
	// await getConfigurationFromRemoteStorage()
	return env.DB_CONFIG;
};
