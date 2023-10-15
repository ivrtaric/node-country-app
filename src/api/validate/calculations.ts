import * as z from 'zod';

const positiveIntValidator = z.number().int().positive();

export const optimalRouteParameterValidator = z.object({
	source_country_id: z.string().transform(Number).pipe(positiveIntValidator),
	target_country_id: z.string().transform(Number).pipe(positiveIntValidator)
});
