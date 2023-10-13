import { Request } from 'express';
import { numberIdValidatorErrorMap } from '.';
import * as z from 'zod';

const addNeighboursValidator = z
	.object({
		neighbour_ids: z.array(z.number()).nonempty('Neighbour IDS array must not be empty')
	})
	.required();

export const validateNeighbourIds = (req: Request) => {
	const { neighbour_ids } = addNeighboursValidator.parse(req.body, {
		errorMap: numberIdValidatorErrorMap(req.params.id, 'Invalid country ID')
	});

	return neighbour_ids;
};
