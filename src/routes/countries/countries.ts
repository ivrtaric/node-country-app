import type { NextFunction, Request, Response } from 'express';
import { getCountries as appGetCountries, getCountryById as appGetCountryById } from 'src/app/countries';
import { Logger } from 'src/util/logger';
import { handleErrorsWrapper } from 'src/middleware/error-handler';

const logger = new Logger('routes:countries');

export const getCountries = handleErrorsWrapper(async (req: Request, res: Response, next: NextFunction) => {
	const countries = await appGetCountries();
	res.json(countries);
});

export const getCountryById = handleErrorsWrapper(async (req: Request, res: Response, next: NextFunction) => {
	const country = await appGetCountryById(Number(req.params.id));
	logger.log(country);
	res.json(country);
});

export const createCountry = handleErrorsWrapper(async (req: Request, res: Response) => {
	res.json({});
});

export const updateCountry = handleErrorsWrapper(async (req: Request, res: Response) => {
	res.json({});
});

export const deleteCountry = handleErrorsWrapper((req: Request, res: Response) => {
	res.json({});
});
