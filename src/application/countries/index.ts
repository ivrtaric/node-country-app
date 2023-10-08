import { getClient } from 'src/db/connect';
import { getCountries as dbGetCountries, getCountryById as dbGetCountryById } from 'src/db/functions';
import { NotFoundError } from 'src/errors';

export const getCountries = async () => {
	const pgClient = await getClient();

	return dbGetCountries(pgClient);
};

export const getCountryById = async (id: number) => {
	const pgClient = await getClient();

	const results = await dbGetCountryById(pgClient, id);
	if (results?.length) {
		return results[0];
	} else {
		throw new NotFoundError('Country', { id });
	}
};
