import * as dotenv from 'dotenv';
import * as os from 'os';

import { bool, cleanEnv, json, num, str } from 'envalid';

const _EnvFiles = {
	development: '.env.local',
	test: '.env.test',
	production: '.env'
};
type EnvFiles = keyof typeof _EnvFiles;

const nodeEnv: EnvFiles = (process.env.NODE_ENV as EnvFiles) ?? 'production';
const parsedEnv = dotenv.config({ path: _EnvFiles[nodeEnv] ?? _EnvFiles.production });

const env = cleanEnv(
	{ ...(parsedEnv.parsed ?? {}), ...process.env },
	{
		PORT: num({ default: 3000 }),
		BASE_PATH: str({ default: '/' }),

		LOG_LEVEL: str({ choices: ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'], default: 'INFO' }),

		DB_CONFIG: json({ desc: 'Additional email parameters', default: null }),
		DB_POOL_SIZE: num({ default: 5 }),

		DB_HOST: str({ default: 'localhost' }),
		DB_PORT: num({ default: 5432 }),
		DB_USER: str({ default: 'postgres' }),
		DB_PASSWORD: str({ default: 'postgres' }),
		DB_NAME: str({ default: 'countryapp' }),

		NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'], default: 'production' }),
		WORKERS: num({ default: os.cpus().length }),
		USE_ORM: bool({ default: false })
	}
);

export default env;
