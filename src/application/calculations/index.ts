import { getWorkerPool } from './worker-pool';
import { WorkerMessage } from './types';
import { getFunctions } from 'src/db';

export const calculateOptimalRoute = async (start: number, end: number) => {
	const neighbourGraphNodes = await getFunctions().getRecursiveNeighbours(start, end);

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
