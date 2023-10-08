import type { Request, Response } from 'express';
import { handleErrorsWrapper } from 'src/api/middleware/error-handler';

export const addNeighbours = handleErrorsWrapper(async (req: Request, res: Response) => {
	res.json({});
});

export const removeNeighbour = handleErrorsWrapper(async (req: Request, res: Response) => {
	res.json({});
});
