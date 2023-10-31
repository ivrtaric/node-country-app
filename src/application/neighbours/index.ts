import { NotFoundError } from 'src/errors';
import { getFunctions } from 'src/db';

export const addNeighbours = async (countryId: number, neighbours: number[]) => {
	const db = getFunctions();

	const countryIds = [countryId, ...neighbours];
	const existingIds = await db.getExistingCountryIds(countryIds);
	const missingIds = countryIds.filter(id => !existingIds.includes(id));

	if (missingIds.length) {
		throw new NotFoundError('Country', { ids: missingIds });
	}

	const results = await db.addNeighbours(countryId, neighbours);
	return results?.length ? results : null;
};

export const removeNeighbour = async (countryId: number, neighbourId: number) => {
	const db = getFunctions();

	const existingIds = await db.getExistingCountryIds([countryId, neighbourId]);

	if (!existingIds.includes(countryId)) {
		throw new NotFoundError('Country', { id: countryId });
	}
	if (!existingIds.includes(neighbourId)) {
		throw new NotFoundError('Country', { id: neighbourId });
	}

	if (!(await db.isNeighbour(countryId, neighbourId))) {
		throw new NotFoundError('Neighbour', { id: neighbourId });
	}

	return db.removeNeighbour(countryId, neighbourId);
};
