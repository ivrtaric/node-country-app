import { PgClient } from 'src/db/connect/pg-client';
import { pgsqlGetCountries, pgsqlGetCountryById } from 'src/db/queries';
import { Country } from 'src/db/schema/types';

export const getCountries = (client: PgClient): Promise<Array<Country>> => client.query(pgsqlGetCountries);

export const getCountryById = (client: PgClient, id: number): Promise<Array<Country>> =>
	client.query(pgsqlGetCountryById, id);
