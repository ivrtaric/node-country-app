import type { Request, Response } from 'express';
import { validateAddNeighboursData, validateCountryId, validateNeighbourId } from 'src/api/validate';
import { addNeighbours as appAddNeighbours } from 'src/application/neighbours';

export const addNeighbours = async (req: Request, res: Response) => {
	const countryId = validateCountryId(req);
	const neighboursData = validateAddNeighboursData(req);

	const response = await appAddNeighbours(countryId, neighboursData);

	res.status(201).json({
		message: `Neighbours added successfully: ${response?.map(n => n.neighbour_id)?.join(', ')}`
	});
};

export const removeNeighbour = async (req: Request, res: Response) => {
	const countryId = validateCountryId(req);
	const neighbourId = validateNeighbourId(req);

	res.json({});
};
