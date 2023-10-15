import { PgClient } from 'src/db/connect/pg-client';
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
} from 'src/db/queries';
import { Country, CreateCountryData, Neighbour, PatchCountryData, PutCountryData } from 'src/types';

export const getExistingCountryIds = async (client: PgClient, countryIds: Array<number | bigint>) =>
	(await client.query<Country>(psqlCheckExistingCountries(countryIds))).map(c => c.id);

export const getCountries = (client: PgClient): Promise<Array<Country>> => client.query(pgsqlGetCountries());

export const getCountryById = (client: PgClient, id: number | bigint): Promise<Array<Country>> =>
	client.query(pgsqlGetCountryById(id));

export const createCountry = (client: PgClient, countryData: CreateCountryData): Promise<Array<Country>> =>
	client.query(pgsqlCreateCountry(countryData));

export const updateCountryById = (
	client: PgClient,
	id: number | bigint,
	countryData: PutCountryData | PatchCountryData
): Promise<Array<Country>> => client.query(pgsqlUpdateCountryById(id, countryData));

export const deleteCountryById = (client: PgClient, id: number | bigint): Promise<Array<Country>> =>
	client.query(pgsqlDeleteCountryById(id));

export const isNeighbour = async (client: PgClient, countryId: number | bigint, neighbourId: number | bigint) => {
	const neighbour = await client.query<Neighbour>(psqlGetNeighbour(countryId, neighbourId));

	return Boolean(neighbour?.length);
};

export const addNeighbours = (
	client: PgClient,
	countryId: number | bigint,
	neighbourIds: Array<number | bigint>
): Promise<Array<Neighbour>> => client.query(pgsqlAddNeighbours(countryId, neighbourIds));

export const removeNeighbour = (
	client: PgClient,
	countryId: number | bigint,
	neighbourId: number | bigint
): Promise<Array<Neighbour>> => client.query<Neighbour>(pgsqlRemoveNeighbour(countryId, neighbourId));

export const getRecursiveNeighbours = async (
	client: PgClient,
	start: number | bigint,
	end: number | bigint
): Promise<Array<Neighbour>> => client.query<Neighbour>(pgsqlGetRecursiveNeighbours(start, end));
