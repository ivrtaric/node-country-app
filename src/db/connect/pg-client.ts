import { Pool, PoolClient } from 'pg';
import { Logger } from 'src/util/logger';

const logger = new Logger('pg-client');

export class PgClient {
	constructor(
		private pool: Pool,
		private squashErrors = false
	) {}

	async disconnect() {
		return this.pool.end();
	}

	async query<T extends object, U>(func: (...args: U[]) => string, ...args: U[]): Promise<Array<T>> {
		const start = Date.now();
		const name = func.name;
		let data: T[] = [];
		let query: string | undefined = undefined;

		let client: PoolClient | undefined = undefined;
		try {
			logger.debug('Opening a connection to DB...');
			client = await this.pool.connect();

			query = func(...args);
			logger.trace(name, query);
			data = (await client.query(query)).rows;
			// data = (await this.pool.query(query)).rows;
			logger.trace(name, data);
		} catch (e) {
			!query ? logger.error(`Failed in function:`, name) : logger.error(`Error executing query:`, query);
			logger.error(e);
			if (!this.squashErrors) {
				throw e;
			}
		} finally {
			logger.info(`${name}, ${Date.now() - start}ms`);
			client?.release();
		}

		return data ?? [];
	}

	async queryNamed<T extends object, U>(func: (...args: U[]) => string, ...args: U[]): Promise<QueryResult<T>> {
		const data = await this.query<T, U>(func, ...args);

		return {
			[this.getPropertyName(func.name)]: data ?? []
		};
	}

	/**
	 * Returns the name of the property in which the query results will be stored.
	 * The logic removes all non-uppercase characters from the functionName, and
	 * then lowercases the first uppercase character in the remaining string.
	 * @example getPropertyName('psqlGetCountries') => 'getCountries'
	 * @param functionName
	 * @private
	 */
	private getPropertyName(functionName: string): string {
		const replaced = functionName.replace(/^[^A-Z]+/, '');
		return replaced.charAt(0).toLowerCase() + replaced.slice(1);
	}
}

export type QueryResult<T> = { [key: string]: T[] };
