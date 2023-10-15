import { Server } from 'http';
import { getClient } from 'src/db/connect';
import { closeWorkerPool } from 'src/application/calculations/worker-pool';

export async function gracefulShutdown(server: Server) {
	const dbClient = await getClient();
	await dbClient
		.disconnect()
		.then(() => closeWorkerPool())
		.then(() => server.close(() => console.log(`Server closed`)))
		.then(() => process.exit());
}
