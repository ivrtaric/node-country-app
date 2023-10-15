import 'app-module-path/cwd';
import { parentPort } from 'worker_threads';

import type { Neighbour } from 'src/types';
import type { WorkerMessage } from './types';

parentPort?.on('message', (data: WorkerMessage) => {
	const { start, end, graph } = data ?? {};
	parentPort?.postMessage(dijkstraShortestPath(start, end, graph));
});

export type WeightedNeighbour = Omit<Neighbour, 'id'> & { weight?: number };

export function dijkstraShortestPath(
	start: number | bigint,
	end: number | bigint,
	graph: Array<WeightedNeighbour>
): Array<number | bigint> {
	if (!graph?.length) {
		return []; // Starting country has no neighbours
	}

	const endingPoints = graph.filter(n => n.neighbour_id === end);
	if (!endingPoints?.length) {
		return []; // Ending country has no neighbours
	}

	const visited = new Set<number | bigint>();
	const distances = new Map<number | bigint, number>();
	const previous = new Map<number | bigint, number | bigint>();

	distances.set(start, 0);

	let countryFrom: number | bigint | undefined = start;
	for (;;) {
		const connections = graph.filter(n => n.country_id === countryFrom && !visited.has(n.neighbour_id));

		for (const connection of connections) {
			const { country_id: fromId, neighbour_id: toId, weight = 1 } = connection;
			const fromDistance = distances.get(fromId) ?? 0;

			if ((distances.get(toId) ?? Infinity) > fromDistance + weight) {
				distances.set(toId, fromDistance + weight);
				previous.set(toId, fromId);
			}
		}

		if (countryFrom) {
			visited.add(countryFrom);
		}

		const unvisitedNodes = [...distances.keys()].filter(key => !visited.has(key));
		if (!unvisitedNodes.length) {
			break;
		}
		unvisitedNodes.sort((a, b) => (distances.get(a) ?? Infinity) - (distances.get(b) ?? Infinity));

		countryFrom = unvisitedNodes[0];
	}

	console.log({ distances, previous });

	const shortestPath = [];
	let previousNode: number | bigint | undefined = end;
	for (;;) {
		shortestPath.unshift(previousNode);
		previousNode = previousNode ? previous.get(previousNode) : undefined;

		if (previousNode === undefined) {
			break;
		}
	}

	return shortestPath;
}
