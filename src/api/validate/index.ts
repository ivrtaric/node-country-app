import { coerce, object, string, ZodErrorMap, ZodIssueCode } from 'zod';

export const validateUuid = object({ id: string().uuid() });

export const numberIdValidator = object({ id: coerce.number().int().positive() });
export const numberIdValidatorErrorMap: (value: string, customMessage?: string) => ZodErrorMap =
	(value: string, customMessage?: string) => e => {
		switch (e.code) {
			case ZodIssueCode.invalid_type:
				return {
					message: `${customMessage ? `${customMessage}: ` : ''}Expected a positive integer, got "${value}"`
				};
			default:
				return { message: `Unknown validation error` };
		}
	};

const countryDataValidator = object({
	name: string(),
	code: string(),
	code_alpha_2: string(),
	code_alpha_3: string(),
	flag: string()
});
export const requiredCountryDataValidator = countryDataValidator.required().partial({ flag: true });
export const partialCountryDataValidator = countryDataValidator.partial();
export const countryDataValidatorErrorMap: (customMessage?: string) => ZodErrorMap =
	(customMessage?: string) => (e, ctx) => {
		const customPrefix = customMessage ? `${customMessage}: ` : '';
		switch (e.code) {
			case ZodIssueCode.invalid_type: {
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
