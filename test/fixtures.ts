import 'app-module-path/cwd';
import { start } from 'src/app';
import { Server } from 'http';
import { gracefulShutdown } from 'src/util/server';

let server: Server;

export const mochaGlobalSetup = async () => {
	console.log('Mocha Global Setup');
	const appValues = start();
	server = appValues.server;
};

export const mochaGlobalTeardown = async () => {
	console.log('Mocha Global Teardown');
	await gracefulShutdown(server);
};
