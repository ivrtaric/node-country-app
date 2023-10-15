import { Worker } from 'node:worker_threads';
import * as path from 'node:path';

import { getClient } from 'src/db/connect';
import { getRecursiveNeighbours } from 'src/db/functions';
import { Neighbour } from 'src/types';

export const calculateOptimalRoute = async (start: number, end: number) => {
	const pgClient = await getClient();
	const neighbourGraphNodes = await getRecursiveNeighbours(pgClient, start, end);

	const workerRunnerPath = path.join(__dirname, 'run-worker.js');
	const optimal_route = await new Promise((resolve, reject) => {
		const worker = new Worker(workerRunnerPath, {
			workerData: {
				start,
				end,
				graph: neighbourGraphNodes,
				path: './worker.ts'
			}
		});

		worker.on('error', (e: Error) => {
			reject(e);
		});

		worker.on('message', (result: unknown) => {
			resolve(result);
		});
	});

	return optimal_route;
};

export interface WorkerData {
	start: number;
	end: number;
	graph: Array<Neighbour>;
	path: string;
}
