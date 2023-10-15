import { Request } from 'express';
import { numberIdValidatorErrorMap } from '.';
import * as z from 'zod';

export const numberNeighbourIdValidator = z.object({ neighbourId: z.coerce.number().int().positive() });
export const validateNeighbourId = (req: Request) => {
	const { neighbourId } = numberNeighbourIdValidator.parse(req.params, {
		errorMap: numberIdValidatorErrorMap('Invalid neighbour ID')
	});

	return neighbourId;
};

const addNeighboursValidator = z
	.object({
		neighbour_ids: z.array(z.number().int().positive()).nonempty('Neighbour IDS array must not be empty')
	})
	.required();

export const validateAddNeighboursData = (req: Request) => {
	const { neighbour_ids } = addNeighboursValidator.parse(req.body, {
		errorMap: numberIdValidatorErrorMap('Invalid neighbour IDs array')
	});

	return neighbour_ids;
};
