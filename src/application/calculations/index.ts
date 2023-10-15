import { getClient } from 'src/db/connect';
import { getRecursiveNeighbours } from 'src/db/functions';

import { getWorkerPool } from './worker-pool';
import { WorkerMessage } from './types';

export const calculateOptimalRoute = async (start: number, end: number) => {
	const pgClient = await getClient();
	const neighbourGraphNodes = await getRecursiveNeighbours(pgClient, start, end);

	const optimal_route = await new Promise((resolve, reject) => {
		const task: WorkerMessage = {
			start,
			end,
			graph: neighbourGraphNodes
		};
		getWorkerPool().runTask(task, (err: Error, result: Array<number | bigint>) =>
			err ? reject(err) : resolve(result)
		);
	});

	return optimal_route;
};
