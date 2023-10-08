import { PgClient } from './pg-client';
import { connectPool } from './pool';

let client: PgClient | undefined = undefined;

export const getClient = async (): Promise<PgClient> => {
	client = client ?? new PgClient(await connectPool());
	return client;
};
