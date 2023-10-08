import 'app-module-path/cwd';
import { start } from 'src/app';
import { gracefulShutdown } from 'src/util/server';

const { server } = start();

process.on('SIGTERM', async () => {
	console.log(`SIGTERM received`);
	await gracefulShutdown(server);
});

process.on('SIGINT', async () => {
	console.log(`SIGINT received`);
	await gracefulShutdown(server);
});
