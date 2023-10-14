import { PgClient } from 'src/db/connect/pg-client';
import {
	pgsqlAddNeighbours,
	pgsqlCreateCountry,
	pgsqlDeleteCountryById,
	pgsqlGetCountries,
	pgsqlGetCountryById,
	pgsqlUpdateCountryById,
	psqlCheckExistingCountries
} from 'src/db/queries';
import { Country, CreateCountryData, Neighbour, PatchCountryData, PutCountryData } from 'src/types';

export const getExistingCountryIds = async (client: PgClient, countryIds: Array<number>) =>
	(await client.query<Country>(psqlCheckExistingCountries(countryIds))).map(c => c.id);

export const getCountries = (client: PgClient): Promise<Array<Country>> => client.query(pgsqlGetCountries());

export const getCountryById = (client: PgClient, id: number): Promise<Array<Country>> =>
	client.query(pgsqlGetCountryById(id));

export const createCountry = (client: PgClient, countryData: CreateCountryData): Promise<Array<Country>> =>
	client.query(pgsqlCreateCountry(countryData));

export const updateCountryById = (
	client: PgClient,
	id: number,
	countryData: PutCountryData | PatchCountryData
): Promise<Array<Country>> => client.query(pgsqlUpdateCountryById(id, countryData));

export const deleteCountryById = (client: PgClient, id: number): Promise<Array<Country>> =>
	client.query(pgsqlDeleteCountryById(id));

export const addNeighbours = (
	client: PgClient,
	countryId: number,
	neighbourIds: Array<number>
): Promise<Array<Neighbour>> => client.query(pgsqlAddNeighbours(countryId, neighbourIds));
