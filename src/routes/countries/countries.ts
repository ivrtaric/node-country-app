import type { Request, Response } from 'express';

export const getCountries = (req: Request, res: Response) => {
	res.json([
		{
			id: 1,
			name: 'United States',
			code: 'USA',
			code_alpha_2: 'US',
			code_alpha_3: 'USA',
			flag: 'us_flag.png'
		},
		{
			id: 2,
			name: 'Canada',
			code: 'CAN',
			code_alpha_2: 'CA',
			code_alpha_3: 'CAN',
			flag: 'canada_flag.png'
		}
		// More countries...
	]);
};

export const getCountryById = (req: Request, res: Response) => {
	res.json({});
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
