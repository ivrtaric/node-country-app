import { drizzle } from 'drizzle-orm/node-postgres';

import { connectPool } from '../pool';
import { Logger } from 'src/util/logger';

export type DrizzleClient = ReturnType<typeof drizzle> & { disconnect: () => Promise<void> };

const logger = new Logger('db/drizzle');

let client: DrizzleClient | undefined;

export const getClient = async (): Promise<DrizzleClient> => {
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

	const drizzleClient = drizzle(pool);
	client = Object.assign(drizzleClient, { disconnect: () => pool?.end() });

	return client;
};
