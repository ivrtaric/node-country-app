import type { NextFunction, Request, Response } from 'express';
import { getCountries as appGetCountries, getCountryById as appGetCountryById } from 'src/application/countries';

// const logger = new Logger('routes:countries');

export const getCountries = async (req: Request, res: Response, next: NextFunction) => {
	const countries = await appGetCountries();
	res.json(countries);
};

export const getCountryById = async (req: Request, res: Response, next: NextFunction) => {
	const country = await appGetCountryById(Number(req.params.id));
	res.json(country);
};

export const createCountry = async (req: Request, res: Response) => {
	res.json({});
};

export const updateCountry = async (req: Request, res: Response) => {
	res.json({});
};

export const deleteCountry = (req: Request, res: Response) => {
	res.json({});
};
