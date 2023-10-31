import { PgClient } from './pg-client';
import { connectPool } from '../pool';
import { Logger } from 'src/util/logger';

const logger = new Logger('db/raw');

let client: PgClient | undefined = undefined;

export const getClient = async (): Promise<PgClient> => {
	logger.trace('getClient()');

	if (client) {
		return client;
	}

	logger.debug('Creating DB connection pool...');

	const pool = await connectPool();
	pool.on('error', (err, poolClient) => {
		client?.disconnect();
		client = undefined;
	});
	client = new PgClient(pool);

	return client;
};
