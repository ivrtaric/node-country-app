import { dijkstraShortestPath, WeightedNeighbour } from '../worker';
import { expect } from 'chai';

describe('dijkstra()', () => {
	describe('Test suite 1', () => {
		const graph: Array<WeightedNeighbour> = [
			{ country_id: 1, neighbour_id: 2, weight: 6 },
			{ country_id: 2, neighbour_id: 1, weight: 6 },

			{ country_id: 1, neighbour_id: 4, weight: 1 },
			{ country_id: 4, neighbour_id: 1, weight: 1 },

			{ country_id: 2, neighbour_id: 3, weight: 5 },
			{ country_id: 3, neighbour_id: 2, weight: 5 },

			{ country_id: 2, neighbour_id: 4, weight: 2 },
			{ country_id: 4, neighbour_id: 2, weight: 2 },

			{ country_id: 2, neighbour_id: 5, weight: 2 },
			{ country_id: 5, neighbour_id: 2, weight: 2 },

			{ country_id: 3, neighbour_id: 5, weight: 5 },
			{ country_id: 5, neighbour_id: 3, weight: 5 },

			{ country_id: 4, neighbour_id: 5, weight: 1 },
			{ country_id: 5, neighbour_id: 4, weight: 1 }
		];

		it('should find the shortest path between 1 and 2', async () => {
			const result = dijkstraShortestPath(1, 2, graph);

			expect(result).to.deep.equal([1, 4, 2]);
		});

		it('should find the shortest path between 1 and 3', async () => {
			const result = dijkstraShortestPath(1, 3, graph);

			expect(result).to.deep.equal([1, 4, 5, 3]);
		});
	});

	describe('Test suite 2', () => {
		const graph: Array<WeightedNeighbour> = [
			{ country_id: 1, neighbour_id: 2, weight: 2 },
			{ country_id: 2, neighbour_id: 1, weight: 2 },

			{ country_id: 1, neighbour_id: 4, weight: 8 },
			{ country_id: 4, neighbour_id: 1, weight: 8 },

			{ country_id: 2, neighbour_id: 4, weight: 5 },
			{ country_id: 4, neighbour_id: 2, weight: 5 },

			{ country_id: 2, neighbour_id: 5, weight: 6 },
			{ country_id: 5, neighbour_id: 2, weight: 6 },

			{ country_id: 3, neighbour_id: 5, weight: 9 },
			{ country_id: 5, neighbour_id: 3, weight: 9 },

			{ country_id: 3, neighbour_id: 6, weight: 3 },
			{ country_id: 6, neighbour_id: 3, weight: 3 },

			{ country_id: 4, neighbour_id: 5, weight: 3 },
			{ country_id: 5, neighbour_id: 4, weight: 3 },

			{ country_id: 4, neighbour_id: 6, weight: 2 },
			{ country_id: 6, neighbour_id: 4, weight: 2 },

			{ country_id: 5, neighbour_id: 6, weight: 1 },
			{ country_id: 6, neighbour_id: 5, weight: 1 }
		];

		it('should find the shortest path between 1 and 3', async () => {
			const result = dijkstraShortestPath(1, 3, graph);

			expect(result).to.deep.equal([1, 2, 4, 6, 3]);
		});

		it('should find the shortest path between 1 and 4', async () => {
			const result = dijkstraShortestPath(1, 4, graph);

			expect(result).to.deep.equal([1, 2, 4]);
		});
	});

	describe('Test suite - directed graph', () => {
		const graph: Array<WeightedNeighbour> = [
			{ country_id: 1, neighbour_id: 2, weight: 1 },
			{ country_id: 1, neighbour_id: 3, weight: 5 },
			{ country_id: 2, neighbour_id: 3, weight: 2 },
			{ country_id: 2, neighbour_id: 4, weight: 2 },
			{ country_id: 2, neighbour_id: 5, weight: 1 },
			{ country_id: 3, neighbour_id: 5, weight: 2 },
			{ country_id: 4, neighbour_id: 5, weight: 3 },
			{ country_id: 4, neighbour_id: 6, weight: 1 },
			{ country_id: 5, neighbour_id: 6, weight: 2 }
		];

		(
			[
				[1, 2, [1, 2]],
				[1, 3, [1, 2, 3]],
				[1, 4, [1, 2, 4]],
				[1, 5, [1, 2, 5]],
				[1, 6, [1, 2, 5, 6]]
			] as Array<[number, number, Array<number>]>
		).forEach(([start, end, expected]) =>
			it(`should find the shortest path between ${start} and ${end}`, () => {
				expect(dijkstraShortestPath(start, end, graph)).to.deep.equal(expected);
			})
		);
	});
});
