import { getClient } from 'src/db/connect';
import {
	addNeighbours as dbAddNeighbours,
	getExistingCountryIds,
	isNeighbour,
	removeNeighbour as dbRemoveNeighbour
} from 'src/db/functions';
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

export const removeNeighbour = async (countryId: number, neighbourId: number) => {
	const pgClient = await getClient();

	const existingIds = await getExistingCountryIds(pgClient, [countryId, neighbourId]);

	if (!existingIds.includes(countryId)) {
		throw new NotFoundError('Country', { id: countryId });
	}
	if (!existingIds.includes(neighbourId)) {
		throw new NotFoundError('Country', { id: neighbourId });
	}

	if (!(await isNeighbour(pgClient, countryId, neighbourId))) {
		throw new NotFoundError('Neighbour', { id: neighbourId });
	}

	return dbRemoveNeighbour(pgClient, countryId, neighbourId);
};
