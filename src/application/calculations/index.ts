import { Worker } from 'node:worker_threads';

import { getClient } from 'src/db/connect';
import { getRecursiveNeighbours } from 'src/db/functions';
import { Neighbour } from 'src/types';

export const calculateOptimalRoute = async (start: number, end: number) => {
	const pgClient = await getClient();
	const neighbourGraphNodes = await getRecursiveNeighbours(pgClient, start, end);

	if (!neighbourGraphNodes?.length) {
		return []; // Starting country has no neighbours
	}

	const endingPoints = neighbourGraphNodes.filter(n => n.neighbour_id === end);
	if (!endingPoints?.length) {
		return []; // Ending country has no neighbours
	}

	return new Promise((resolve, reject) => {
		const worker = new Worker('./run-worker.js', {
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
};

export interface WorkerData {
	start: number;
	end: number;
	graph: Array<Neighbour>;
	path: string;
}
