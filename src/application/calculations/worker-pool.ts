import * as path from 'node:path';

import { WorkerPool } from 'src/util/worker-pool';
import env from 'src/env';
import type { WorkerData } from './types';

let workerPool: WorkerPool<WorkerData> | undefined = undefined;

const workerRunnerPath = path.join(__dirname, 'run-worker.js');

export const getWorkerPool = () => {
	workerPool = workerPool ?? new WorkerPool(env.WORKERS, workerRunnerPath, { path: './worker.ts' });
	return workerPool;
};

export const closeWorkerPool = () => workerPool?.close();
