import {
	pgsqlAddNeighbours,
	pgsqlCreateCountry,
	pgsqlDeleteCountryById,
	pgsqlGetCountries,
	pgsqlGetCountryById,
	pgsqlGetRecursiveNeighbours,
	pgsqlRemoveNeighbour,
	pgsqlUpdateCountryById,
	psqlCheckExistingCountries,
	psqlGetNeighbour
} from 'src/db/raw/queries';
import { Country, CreateCountryData, Neighbour } from 'src/types';
import { getClient } from '.';
import { DbFunctions } from 'src/db/types';

export class RawDbFunctions implements DbFunctions<Country, Neighbour> {
	async addNeighbours(countryId: number | bigint, neighbourIds: Array<number | bigint>): Promise<Array<Neighbour>> {
		return getClient().then(client => client.query(pgsqlAddNeighbours(countryId, neighbourIds)));
	}

	async createCountry(countryData: CreateCountryData): Promise<Array<Country>> {
		return getClient().then(client => client.query(pgsqlCreateCountry(countryData)));
	}

	async deleteCountryById(id: number | bigint): Promise<Array<Country>> {
		return getClient().then(client => client.query(pgsqlDeleteCountryById(id)));
	}

	async getCountries(): Promise<Array<Country>> {
		return getClient().then(client => client.query(pgsqlGetCountries()));
	}

	async getCountryById(id: number | bigint): Promise<Array<Country>> {
		return getClient().then(client => client.query(pgsqlGetCountryById(id)));
	}

	async getExistingCountryIds(countryIds: Array<number | bigint>): Promise<Array<number | bigint>> {
		const client = await getClient();
		const countries = await client.query<Country>(psqlCheckExistingCountries(countryIds));
		return countries.map(c => c.id);
	}

	async getRecursiveNeighbours(start: number | bigint, end: number | bigint): Promise<Array<Neighbour>> {
		return getClient().then(client => client.query<Neighbour>(pgsqlGetRecursiveNeighbours(start, end)));
	}

	async isNeighbour(countryId: number | bigint, neighbourId: number | bigint): Promise<boolean> {
		const client = await getClient();
		const neighbour = await client.query<Neighbour>(psqlGetNeighbour(countryId, neighbourId));

		return Boolean(neighbour?.length);
	}

	async removeNeighbour(countryId: number | bigint, neighbourId: number | bigint): Promise<Array<Neighbour>> {
		return getClient().then(client => client.query<Neighbour>(pgsqlRemoveNeighbour(countryId, neighbourId)));
	}

	async updateCountryById(id: number | bigint, countryData: Partial<Country>): Promise<Array<Country>> {
		return getClient().then(client => client.query(pgsqlUpdateCountryById(id, countryData)));
	}
}
