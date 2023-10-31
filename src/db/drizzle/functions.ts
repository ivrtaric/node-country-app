import { and, eq, inArray, sql } from 'drizzle-orm';

import { pgsqlGetRecursiveNeighbours } from '../raw/queries';
import { getClient } from '.';
import { Countries, Country, Neighbour, Neighbours, NewCountry, NewNeighbour } from './schema';
import { DbFunctions } from 'src/db/types';

export class DrizzleDbFunctions implements DbFunctions<Country, Neighbour> {
	async addNeighbours(countryId: number | bigint, neighbourIds: Array<number | bigint>): Promise<Array<Neighbour>> {
		return getClient().then(client =>
			client
				.insert(Neighbours)
				.values(
					neighbourIds.map(
						neighbourId =>
							({
								country_id: countryId as number,
								neighbour_id: neighbourId as number
							}) as NewNeighbour
					)
				)
				.onConflictDoNothing()
				.returning()
		);
	}

	async createCountry(countryData: Omit<NewCountry, 'id'>): Promise<Array<Country>> {
		return getClient().then(client => client.insert(Countries).values(countryData).returning());
	}

	async deleteCountryById(id: number | bigint): Promise<Array<Country>> {
		return getClient().then(client =>
			client
				.delete(Countries)
				.where(eq(Countries.id, id as number))
				.returning()
		);
	}

	async getCountries(): Promise<Array<Country>> {
		return getClient().then(client => client.select().from(Countries));
	}

	async getCountryById(id: number | bigint): Promise<Array<Country>> {
		return getClient().then(client =>
			client
				.select()
				.from(Countries)
				.where(eq(Countries.id, id as number))
		);
	}

	async getExistingCountryIds(countryIds: Array<number | bigint>): Promise<Array<number | bigint>> {
		return getClient()
			.then(client =>
				client
					.select({ id: Countries.id })
					.from(Countries)
					.where(inArray(Countries.id, countryIds as Array<number>))
			)
			.then(countries => countries.map(c => c.id));
	}

	async getRecursiveNeighbours(start: number | bigint, end: number | bigint): Promise<Array<Neighbour>> {
		const client = await getClient();
		return (await client.execute<Neighbour>(sql.raw(pgsqlGetRecursiveNeighbours(start, end)))).rows;
	}

	async isNeighbour(countryId: number | bigint, neighbourId: number | bigint): Promise<boolean> {
		const client = await getClient();
		const neighbour = await client
			.select()
			.from(Neighbours)
			.where(
				and(eq(Neighbours.country_id, countryId as number), eq(Neighbours.neighbour_id, neighbourId as number))
			);

		return Boolean(neighbour?.length);
	}

	async removeNeighbour(countryId: number | bigint, neighbourId: number | bigint): Promise<Array<Neighbour>> {
		return getClient().then(client =>
			client
				.delete(Neighbours)
				.where(
					and(
						eq(Neighbours.country_id, countryId as number),
						eq(Neighbours.neighbour_id, neighbourId as number)
					)
				)
				.returning()
		);
	}

	async updateCountryById(id: number | bigint, countryData: Partial<Country>): Promise<Array<Country>> {
		return getClient().then(client =>
			client
				.update(Countries)
				.set(countryData)
				.where(eq(Countries.id, id as number))
				.returning()
		);
	}
}
