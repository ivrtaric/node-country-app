import { NotFoundError } from 'src/errors';
import { CreateCountryData, PatchCountryData, PutCountryData } from 'src/types';
import { getFunctions } from 'src/db';

export const getCountries = async () => getFunctions().getCountries();

export const getCountryById = async (id: number) => {
	const results = await getFunctions().getCountryById(id);
	if (results?.length) {
		return results[0];
	} else {
		throw new NotFoundError('Country', { id });
	}
};

export const createCountry = async (countryData: CreateCountryData) => {
	const results = await getFunctions().createCountry(countryData);
	return results?.length ? results[0] : null;
};

export const updateCountry = async (countryId: number, countryData: PutCountryData | PatchCountryData) => {
	const results = await getFunctions().updateCountryById(countryId, countryData);
	if (!results?.length) {
		throw new NotFoundError('Country', { id: countryId });
	}

	return results[0];
};

export const deleteCountry = async (countryId: number) => {
	const results = await getFunctions().deleteCountryById(countryId);
	if (!results?.length) {
		throw new NotFoundError('Country', { id: countryId });
	}

	return { message: `Successfully deleted Country ${JSON.stringify({ id: countryId })}` };
};
