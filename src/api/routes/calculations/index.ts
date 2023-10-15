import type { Request, Response } from 'express';

import { optimalRouteParameterValidator } from 'src/api/validate';
import { calculateOptimalRoute as appCalculateOptimalRoute } from 'src/application/calculations';

export const calculateOptimalRoute = async (req: Request, res: Response) => {
	const { source_country_id, target_country_id } = optimalRouteParameterValidator.parse(req.query);

	const optimal_route = await appCalculateOptimalRoute(source_country_id, target_country_id);

	res.json({ source_country_id, target_country_id, optimal_route });
};
