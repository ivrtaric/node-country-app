import * as z from 'zod';

export * from './countries';
export * from './neighbours';

export const numberIdValidator = z.object({ id: z.coerce.number().int().positive() });

export const numberIdValidatorErrorMap: (value: string, customMessage?: string) => z.ZodErrorMap =
	(value: string, customMessage?: string) => e => {
		switch (e.code) {
			case z.ZodIssueCode.invalid_type:
				return {
					message: `${customMessage ? `${customMessage}: ` : ''}Expected a positive integer, got "${value}"`
				};
			default:
				return { message: `Unknown validation error` };
		}
	};
