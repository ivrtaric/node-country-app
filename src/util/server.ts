import { Server } from 'http';
import { getClient } from 'src/db/connect';
import { closeWorkerPool } from 'src/application/calculations/worker-pool';

export async function gracefulShutdown(server: Server, code?: number) {
	const dbClient = await getClient();
	return dbClient
		.disconnect()
		.then(() => closeWorkerPool())
		.then(() =>
			server.close(() => {
				console.log(`Server closed`);
				process.exit((code ?? 0) + 128);
			})
		);
}
