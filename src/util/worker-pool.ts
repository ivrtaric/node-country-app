// https://amagiacademy.com/blog/posts/2021-04-09/node-worker-threads-pool

import { AsyncResource } from 'async_hooks';
import { EventEmitter } from 'events';
import * as path from 'path';
import { Worker } from 'node:worker_threads';

import { Logger } from 'src/util/logger';

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

const logger = new Logger('worker-pool');

class WorkerPoolTaskInfo extends AsyncResource {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(public callback: any) {
		super('WorkerPoolTaskInfo');
	}

	done<T>(err: Error | null | undefined, result: T) {
		this.runInAsyncScope(this.callback, null, err, result);
		this.emitDestroy(); // `TaskInfo`s are used only once.
	}
}

type WorkerWithPoolTaskInfo = Worker & { [kTaskInfo]?: WorkerPoolTaskInfo | null };

export class WorkerPool<WorkerData> extends EventEmitter {
	workers: Array<WorkerWithPoolTaskInfo>;
	freeWorkers: Array<WorkerWithPoolTaskInfo>;

	constructor(
		private numThreads: number,
		private workerFile: string,
		private workerData?: WorkerData
	) {
		super();
		this.workers = [];
		this.freeWorkers = [];

		logger.info(`Starting workers...`);
		for (let i = 0; i < this.numThreads; i++) {
			this.addNewWorker();
		}
		logger.info(`Created a pool of ${this.workers.length} worker processes`);
	}

	addNewWorker() {
		// prettier-ignore
		const worker: WorkerWithPoolTaskInfo = new Worker(
			path.resolve(this.workerFile),
			this.workerData ? { workerData: this.workerData } : undefined
		);
		worker.on('message', result => {
			// In case of success: Call the callback that was passed to `runTask`,
			// remove the `TaskInfo` associated with the Worker, and mark it as free
			// again.
			worker[kTaskInfo]?.done(null, result);
			worker[kTaskInfo] = null;
			this.freeWorkers.push(worker);
			this.emit(kWorkerFreedEvent);
		});
		worker.on('error', err => {
			// In case of an uncaught exception: Call the callback that was passed to
			// `runTask` with the error.
			if (worker[kTaskInfo]) {
				worker[kTaskInfo]!.done(err, null);
			} else {
				this.emit('error', err);
			}
			// Remove the worker from the list and start a new Worker to replace the
			// current one.
			this.workers.splice(this.workers.indexOf(worker), 1);
			this.addNewWorker();
		});
		this.workers.push(worker);
		this.freeWorkers.push(worker);
		this.emit(kWorkerFreedEvent);
		logger.debug(`Created a worker process #${worker.threadId}`);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	runTask<T>(task: T, callback: any) {
		if (this.freeWorkers.length === 0) {
			// No free threads, wait until a worker thread becomes free.
			this.once(kWorkerFreedEvent, () => this.runTask(task, callback));
			return;
		}

		const worker = this.freeWorkers.pop();
		logger.debug(`Running task on worker #${worker!.threadId}...`);
		worker![kTaskInfo] = new WorkerPoolTaskInfo(callback);
		worker!.postMessage(task);
	}

	close() {
		logger.info(`Shutting down workers...`);
		for (const worker of this.workers) {
			logger.debug(`Closing worker #${worker.threadId}`);
			worker.terminate();
		}
		logger.info(`Done.`);
	}
}
