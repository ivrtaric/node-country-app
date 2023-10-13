import type { NextFunction, Request, Response } from 'express';
import {
	createCountry as appCreateCountry,
	getCountries as appGetCountries,
	getCountryById as appGetCountryById,
	updateCountry as appUpdateCountry
} from 'src/application/countries';
import {
	countryDataValidatorErrorMap,
	numberIdValidator,
	numberIdValidatorErrorMap,
	partialCountryDataValidator,
	requiredCountryDataValidator
} from 'src/api/validate';
import { CreateCountryData, PatchCountryData, PutCountryData } from 'src/types';
import { Logger } from 'src/util/logger';

const logger = new Logger('routes:countries');

export const getCountries = async (req: Request, res: Response, next: NextFunction) => {
	const countries = await appGetCountries();
	res.json(countries);
};

export const getCountryById = async (req: Request, res: Response, next: NextFunction) => {
	const countryId = validateCountryId(req);
	const country = await appGetCountryById(countryId);
	res.json(country);
};

export const createCountry = async (req: Request, res: Response) => {
	const countryData = validateCountryData(req);

	const country = await appCreateCountry(countryData as CreateCountryData);

	res.json(country);
};

export const updateCountryComplete = async (req: Request, res: Response) => {
	const countryId = validateCountryId(req);
	const countryData = validateCountryData(req);

	const country = await appUpdateCountry(countryId, countryData as PutCountryData);

	res.json(country);
};

export const updateCountryPartial = async (req: Request, res: Response) => {
	const countryId = validateCountryId(req);
	const countryData = validateCountryData(req, true);

	const country = await appUpdateCountry(countryId, countryData as PatchCountryData);

	res.json(country);
};

export const deleteCountry = (req: Request, res: Response) => {
	const countryId = validateCountryId(req);

	res.json({});
};

const validateCountryId = (req: Request) => {
	const { id } = numberIdValidator.parse(req.params, {
		errorMap: numberIdValidatorErrorMap(req.params.id, 'Invalid country ID')
	});

	return id;
};

const validateCountryData = (req: Request, partial = false) => {
	const data = (partial ? partialCountryDataValidator : requiredCountryDataValidator).parse(req.body, {
		errorMap: countryDataValidatorErrorMap('Invalid country data')
	});

	return data;
};
