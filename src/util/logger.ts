import Debug from 'debug';

export const enum LogLevelName {
	ERROR = 'ERROR',
	WARN = 'WARN',
	INFO = 'INFO',
	DEBUG = 'DEBUG',
	TRACE = 'TRACE'
}
const LogLevel = {
	ERROR: 4,
	WARN: 3,
	INFO: 2,
	DEBUG: 1,
	TRACE: 0
};

export class Logger {
	private logLevel: number;
	private _debugInstance;

	constructor(_loggingPrefix: string | null = null, minLogLevel?: keyof typeof LogLevel) {
		if (minLogLevel) {
			this.logLevel = LogLevel[minLogLevel];
		} else {
			const { LOG_LEVEL = 'INFO' } = process.env;
			const envLogLevel = LOG_LEVEL.trim().toUpperCase();

			this.logLevel = isLogLevel(envLogLevel) ? LogLevel[envLogLevel] : LogLevel.INFO;
		}

		this._debugInstance = Debug(_loggingPrefix ?? `Log-${Date.now()}`);
	}

	trace(...data: unknown[]) {
		if (this.logLevel <= 0) {
			this._debugInstance(this.logMessage('TRACE', data).join(' '));
		}
	}

	debug(...data: unknown[]) {
		if (this.logLevel <= 1) {
			this._debugInstance(this.logMessage('DEBUG', data).join(' '));
		}
	}

	info(...data: unknown[]) {
		if (this.logLevel <= 2) {
			this._debugInstance(this.logMessage('INFO', data).join(' '));
		}
	}

	warn(...data: unknown[]) {
		if (this.logLevel <= 3) {
			this._debugInstance(this.logMessage('WARN', data).join(' '));
		}
	}

	log(...data: unknown[]) {
		this.info(data);
	}

	error(...data: unknown[]) {
		this._debugInstance(this.logMessage('ERROR', data).join(' '));
	}

	private logMessage<T>(logLevel: keyof typeof LogLevel, data: T[]): (T | string)[] {
		return [logLevel, String(Date.now()), ...data];
	}
}

const isLogLevel = (value?: string): value is keyof typeof LogLevel => Object.keys(LogLevel).includes(value ?? '');
