import { Neighbour } from 'src/types';

export interface WorkerData {
	path: string;
}

export type WorkerMessage = {
	start: number | bigint;
	end: number | bigint;
	graph: Array<Neighbour>;
};
