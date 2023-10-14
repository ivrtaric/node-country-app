import { getClient } from 'src/db/connect';
import { addNeighbours as dbAddNeighbours, getExistingCountryIds } from 'src/db/functions';
import { NotFoundError } from 'src/errors';

export const addNeighbours = async (countryId: number, neighbours: number[]) => {
	const pgClient = await getClient();

	const countryIds = [countryId, ...neighbours];
	const existingIds = await getExistingCountryIds(pgClient, countryIds);
	const missingIds = countryIds.filter(id => !existingIds.includes(id));

	if (missingIds.length) {
		throw new NotFoundError('Country', { ids: missingIds });
	}

	const results = await dbAddNeighbours(pgClient, countryId, neighbours);
	return results?.length ? results : null;
};
