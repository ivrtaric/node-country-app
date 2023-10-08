import format from 'pg-format';

export const pgsqlGetCountries = () => format(`SELECT * FROM country`);

export const pgsqlGetCountryById = (id: number) => format(`SELECT * FROM country WHERE id = %1$L`, id);

export const updateCountryById = (id: number) => format(`SELECT * FROM country WHERE id = %1$L`, id);
