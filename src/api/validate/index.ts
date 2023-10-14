import * as z from 'zod';

export * from './countries';
export * from './neighbours';

export const positiveIntValidator = z.number().int().positive();

export const numberIdValidator = z.object({ id: z.coerce.number().int().positive() });

export const numberIdValidatorErrorMap =
	(customMessage?: string, value?: unknown): z.ZodErrorMap =>
	e => {
		const prefix = customMessage ? `${customMessage}: ` : '';
		switch (e.code) {
			case z.ZodIssueCode.invalid_type:
				return { message: `${prefix}Expected a positive integer, got "${value ?? e.received}"` };
			default:
				return { message: `Unknown validation error` };
		}
	};
