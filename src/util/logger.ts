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

	constructor(
		private loggingPrefix: string | null = null,
		minLogLevel?: keyof typeof LogLevel
	) {
		if (minLogLevel) {
			this.logLevel = LogLevel[minLogLevel];
		} else {
			const { LOG_LEVEL = 'INFO' } = process.env;
			const envLogLevel = LOG_LEVEL.trim().toUpperCase();

			this.logLevel = isLogLevel(envLogLevel) ? LogLevel[envLogLevel] : LogLevel.INFO;
		}
	}

	trace(...data: unknown[]) {
		if (this.logLevel <= 0) {
			console.trace(...this.logMessage('TRACE', data));
		}
	}

	debug(...data: unknown[]) {
		if (this.logLevel <= 1) {
			console.debug(...this.logMessage('DEBUG', data));
		}
	}

	info(...data: unknown[]) {
		if (this.logLevel <= 2) {
			console.info(...this.logMessage('INFO', data));
		}
	}

	warn(...data: unknown[]) {
		if (this.logLevel <= 3) {
			console.warn(...this.logMessage('WARN', data));
		}
	}

	log(...data: unknown[]) {
		console.log(...this.logMessage('INFO', data));
	}

	error(...data: unknown[]) {
		console.error(...this.logMessage('ERROR', data));
	}

	private logMessage<T>(logLevel: keyof typeof LogLevel, data: T[]): (T | string)[] {
		// prettier-ignore
		return [
			...([
				new Date().toISOString(),
				logLevel,
				this.loggingPrefix ? `[${this.loggingPrefix}]` : null
			].filter(x => x) as string[]),
			...data
		];
	}
}

const isLogLevel = (value?: string): value is keyof typeof LogLevel => Object.keys(LogLevel).includes(value ?? '');
