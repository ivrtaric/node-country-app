import { PgClient } from './pg-client';
import { connectPool } from './pool';

let client: PgClient | undefined = undefined;

export const getClient = async (): Promise<PgClient> => {
	if (client) {
		return client;
	}

	const pool = await connectPool();
	pool.on('error', (err, poolClient) => {
		client?.disconnect();
		client = undefined;
	});
	client = new PgClient(pool);

	return client;
};
