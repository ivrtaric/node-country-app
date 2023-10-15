import { parentPort, workerData } from 'worker_threads';
import type { Neighbour } from 'src/types';
import type { WorkerData } from '.';

export type WeightedNeighbour = Omit<Neighbour, 'id'> & { weight?: number };

export function dijkstraShortestPath(start: number, end: number, graph: Array<WeightedNeighbour>) {
	if (!graph?.length) {
		return []; // Starting country has no neighbours
	}

	const endingPoints = graph.filter(n => n.neighbour_id === end);
	if (!endingPoints?.length) {
		return []; // Ending country has no neighbours
	}

	// This is a special case for no-weight graphs (i.e. weight for all edges = 1)
	// if (graph.find(n => n.country_id === start && n.neighbour_id === end)) {
	// 	return [start, end]; // Countries are directly connected
	// }

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

const { start, end, graph } = (workerData ?? {}) as WorkerData;
parentPort?.postMessage(dijkstraShortestPath(start, end, graph));
