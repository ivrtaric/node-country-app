import { Server } from 'http';
import { getClient } from 'src/db/connect';

export async function gracefulShutdown(server: Server) {
	const dbClient = await getClient();
	await dbClient
		.disconnect()
		.then(() => console.log('Database disconnected'))
		.then(() => server.close(() => console.log(`Server closed`)))
		.then(() => process.exit());
}
