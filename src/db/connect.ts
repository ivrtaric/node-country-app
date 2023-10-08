import { Pool } from 'pg';
import { Logger } from 'src/util/logger';

const logger = new Logger('db-connect');

export const connectPool = async () =>
	new Pool({
		max: Number(process.env.DB_MAX_CONNECTIONS) || 5,
		...(await getConnectionDetails())
	});

export const getConnectionDetails = async () => {
	const { DB_CONFIG = '{}' } = process.env;
	const config = JSON.parse(DB_CONFIG);
	return {
		...config,
		port: typeof config.port == 'string' ? Number(config.port) : config.port
	};
};

export class PgClient {
	pool: Pool;

	constructor(
		pool: Pool,
		private _catchErrors: boolean = true
	) {
		this.pool = pool;
	}

	async query<T extends object>(func: (...args: unknown[]) => string, ...args: unknown[]): Promise<Array<T>> {
		const start = Date.now();
		const name = func.name;
		let data: T[] = [];
		let query: string | undefined = undefined;
		const client = await this.pool.connect();
		try {
			query = func(...args);
			logger.trace(name, query);
			data = (await client.query(query)).rows;
			logger.trace(name, data);
		} catch (e) {
			!query ? logger.error(`Failed in function:`, name) : logger.error(`Error executing query:`, query);
			logger.error(e);
			if (!this._catchErrors) {
				throw e;
			}
		} finally {
			logger.info(`${name}, ${Date.now() - start}ms`);
			client.release();
		}

		return data ?? [];
	}

	async queryNamed<T extends object>(
		func: (...args: unknown[]) => string,
		...args: unknown[]
	): Promise<QueryResult<T>> {
		const name = func.name;
		const data = await this.query<T>(func, ...args);

		return {
			[this.removeStringBeforeFirstUpperChar(name)]: data ?? []
		};
	}

	private removeStringBeforeFirstUpperChar(functionName: string): string {
		const replaced = functionName.replace(/^[a-z]+/, '');
		return replaced.charAt(0).toLowerCase() + replaced.slice(1);
	}

	set catchErrors(value: boolean) {
		this._catchErrors = value;
	}
}

export type QueryResult<T> = { [key: string]: T[] };
