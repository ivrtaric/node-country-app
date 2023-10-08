import format from 'pg-format';
import { Country } from 'src/db/schema/types';

export const pgsqlGetCountries = () => format(`SELECT * FROM country`);

export const pgsqlGetCountryById = (id: number | bigint) => format(`SELECT * FROM country WHERE id = %1$L`, id);

export const pgsqlCreateCountry = (countryData: Partial<Country>) => {
	const { name, code, code_alpha_2, code_alpha_3, flag } = countryData;
	return format(
		`
    INSERT INTO country("name", code, code_alpha_2, code_alpha_3, flag)
    VALUES(%1$L, %2$L, %3$L, %4$L, %5$L)
  `,
		name,
		code,
		code_alpha_2,
		code_alpha_3,
		flag ?? null
	);
};

export const pgsqlUpdateCountryById = (id: number | bigint) => format(`SELECT * FROM country WHERE id = %1$L`, id);

export const pgsqlDeleteCountryById = (id: number | bigint) => format(`DELETE FROM country WHERE id = %1$L`, id);
