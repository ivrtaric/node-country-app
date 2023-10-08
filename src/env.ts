import * as dotenv from 'dotenv';
import { cleanEnv, json, num, str } from 'envalid';

const _EnvFiles = {
	development: '.env.local',
	test: '.env.test',
	production: '.env'
};
type EnvFiles = keyof typeof _EnvFiles;

const nodeEnv: EnvFiles = (process.env.NODE_ENV as EnvFiles) ?? 'production';
const parsedEnv = dotenv.config({ debug: true, path: _EnvFiles[nodeEnv] ?? _EnvFiles.production });

const env = cleanEnv(parsedEnv.parsed ?? process.env, {
	PORT: num({ default: 3000 }),
	BASE_PATH: str({ default: '/' }),

	LOG_LEVEL: str({ choices: ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'], default: 'INFO' }),

	DB_CONFIG: json({ desc: 'Additional email parameters' }),
	DB_POOL_SIZE: num({ default: 5 }),

	NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'], default: 'production' })
});

export default env;
