import { PgClient } from './pg-client';
import { Pool } from 'pg';

import env from 'src/env';
import { Logger } from 'src/util/logger';

const logger = new Logger('db-connect');

let client: PgClient | undefined = undefined;

export const getClient = async (): Promise<PgClient> => {
	client = client ?? new PgClient(await connectPool());
	return client;
};

export const connectPool = async () => {
	logger.log(`Connecting to database (pooling ${env.DB_POOL_SIZE} connections...)`);
	return new Pool({
		max: env.DB_POOL_SIZE,
		...(await getConnectionDetails())
	});
};

const getConnectionDetails = async () => {
	// await getConfigurationFromRemoteStorage()
	return env.DB_CONFIG;
};
