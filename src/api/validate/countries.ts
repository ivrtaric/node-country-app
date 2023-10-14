import * as z from 'zod';
import { Request } from 'express';
import { numberIdValidator, numberIdValidatorErrorMap } from 'src/api/validate';

export const validateCountryId = (req: Request) => {
	const { id } = numberIdValidator.parse(req.params, {
		errorMap: numberIdValidatorErrorMap('Invalid country ID', req.params.id)
	});

	return id;
};

const countryDataValidator = z.object({
	name: z.string(),
	code: z.string(),
	code_alpha_2: z.string(),
	code_alpha_3: z.string(),
	flag: z.string()
});
export const requiredCountryDataValidator = countryDataValidator.required().partial({ flag: true });
export const partialCountryDataValidator = countryDataValidator.partial();

export const countryDataValidatorErrorMap: (customMessage?: string) => z.ZodErrorMap =
	(customMessage?: string) => (e, ctx) => {
		const customPrefix = customMessage ? `${customMessage}: ` : '';
		switch (e.code) {
			case z.ZodIssueCode.invalid_type: {
				if (ctx.defaultError === 'Required') {
					return { message: `${customPrefix}Missing required property: ${e.path[0]}` };
				} else {
					return { message: `${customPrefix}${e.path[0]} - ${ctx.defaultError}: ${ctx.data}` };
				}
			}
			default:
				return { message: `Unknown validation error` };
		}
	};

export const validateCountryData = (req: Request, partial = false) => {
	const data = (partial ? partialCountryDataValidator : requiredCountryDataValidator).parse(req.body, {
		errorMap: countryDataValidatorErrorMap('Invalid country data')
	});

	return data;
};
