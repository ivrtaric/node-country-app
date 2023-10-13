import { getClient } from 'src/db/connect';
import {
	createCountry as dbCreateCountry,
	deleteCountryById as dbDeleteCountry,
	getCountries as dbGetCountries,
	getCountryById as dbGetCountryById,
	updateCountryById as dbUpdateCountry
} from 'src/db/functions';
import { NotFoundError } from 'src/errors';
import { CreateCountryData, PatchCountryData, PutCountryData } from 'src/types';

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

export const createCountry = async (countryData: CreateCountryData) => {
	const pgClient = await getClient();

	const results = await dbCreateCountry(pgClient, countryData);
	return results ?? null;
};

export const updateCountry = async (countryId: number, countryData: PutCountryData | PatchCountryData) => {
	const pgClient = await getClient();

	const results = await dbUpdateCountry(pgClient, countryId, countryData);
	if (results?.length) {
		return results[0];
	} else {
		throw new NotFoundError('Country', { id: countryId });
	}
};

export const deleteCountry = async (countryId: number) => {
	const pgClient = await getClient();

	const results = await dbDeleteCountry(pgClient, countryId);
	if (results?.length) {
		return results[0];
	} else {
		throw new NotFoundError('Country', { id: countryId });
	}
};
