import type { Request, Response } from 'express';
import { handleErrorsWrapper } from 'src/middleware/error-handler';

export const calculateOptimalRoute = handleErrorsWrapper((req: Request, res: Response) => {
	res.json({});
});
