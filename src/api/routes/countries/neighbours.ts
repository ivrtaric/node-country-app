import type { Request, Response } from 'express';
import { validateCountryId, validateNeighbourIds } from 'src/api/validate';

export const addNeighbours = async (req: Request, res: Response) => {
	const countryId = validateCountryId(req);
	const neighboursData = validateNeighbourIds(req);

	res.json({});
};

export const removeNeighbour = async (req: Request, res: Response) => {
	res.json({});
};
