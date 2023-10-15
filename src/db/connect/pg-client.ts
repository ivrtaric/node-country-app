import { Pool, PoolClient } from 'pg';
import { Logger } from 'src/util/logger';

const logger = new Logger('pg-client');

export class PgClient {
	constructor(
		private pool: Pool,
		private squashErrors = false
	) {}

	async disconnect() {
		logger.info('Disconnecting from database...');
		return this.pool.end().then(() => logger.info('Disconnected.'));
	}

	async query<T extends object>(sqlQuery: string): Promise<Array<T>> {
		const start = Date.now();
		let data: T[] = [];

		let client: PoolClient | undefined = undefined;
		try {
			logger.debug('Opening a connection to DB...');
			client = await this.pool.connect();

			logger.trace(`[${start}]`, sqlQuery);
			data = (await client.query(sqlQuery)).rows;
			// data = (await this.pool.query(query)).rows;
			logger.trace(`[${start}]`, data);
		} catch (e) {
			logger.error(`[${start}]`, `Error executing query:`, sqlQuery);
			logger.error(`[${start}]`, e);
			if (!this.squashErrors) {
				throw e;
			}
		} finally {
			logger.info(`[${start}] ${Date.now() - start}ms`);
			client?.release();
		}

		return data ?? [];
	}
}
