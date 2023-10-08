import type { Request, Response } from 'express';
import { getCountries as appGetCountries, getCountryById as appGetCountryById } from 'src/app/countries';

export const getCountries = async (req: Request, res: Response) => {
	const countries = await appGetCountries();
	res.json(countries);
};

export const getCountryById = async (req: Request, res: Response) => {
	const country = await appGetCountryById(Number(req.params.id));
	res.json(country);
};

export const createCountry = (req: Request, res: Response) => {
	res.json({});
};

export const updateCountry = (req: Request, res: Response) => {
	res.json({});
};

export const deleteCountry = (req: Request, res: Response) => {
	res.json({});
};
