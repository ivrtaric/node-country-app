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
	if (env.DB_CONFIG) {
		logger.debug('Using env.DB_CONFIG');
		return env.DB_CONFIG;
	} else if (env.DB_HOST) {
		logger.debug('Using env.DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME');
		return {
			host: env.DB_HOST,
			port: env.DB_PORT,
			user: env.DB_USER,
			password: env.DB_PASSWORD,
			database: env.DB_NAME
		};
	} else throw new Error('Database connection information not provided');
};
