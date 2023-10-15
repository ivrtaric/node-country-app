import format from 'pg-format';
import { CreateCountryData, PatchCountryData, PutCountryData } from 'src/types';

export const psqlCheckExistingCountries = (countryIds: Array<number | bigint>) =>
	format(`SELECT id FROM country WHERE id IN (%1$L)`, countryIds);

export const pgsqlGetCountries = () => format(`SELECT * FROM country`);

export const pgsqlGetCountryById = (id: number | bigint) => format(`SELECT * FROM country WHERE id = %1$L`, id);

export const pgsqlCreateCountry = (countryData: CreateCountryData) => {
	const { name, code, code_alpha_2, code_alpha_3, flag } = countryData;

	return format(
		`
    INSERT INTO country("name", code, code_alpha_2, code_alpha_3, flag)
    VALUES(%1$L, %2$L, %3$L, %4$L, %5$L)
    RETURNING *
  `,
		name,
		code,
		code_alpha_2,
		code_alpha_3,
		flag ?? null
	);
};

export const pgsqlUpdateCountryById = (id: number | bigint, countryData: PutCountryData | PatchCountryData) => {
	const updateFields = Object.entries(countryData).map(([property, value]) => format(`${property} = %1$L`, value));

	return format(`UPDATE country SET ${updateFields.join(', ')} WHERE id = %1$L RETURNING *`, id);
};

export const pgsqlDeleteCountryById = (id: number | bigint): string =>
	format(`DELETE FROM country WHERE id = %1$L RETURNING *`, id);

export const psqlGetNeighbour = (countryId: number | bigint, neighbourId: number | bigint) =>
	format(`SELECT * FROM neighbours WHERE country_id = %1$L AND neighbour_id = %2$L`, countryId, neighbourId);

export const pgsqlAddNeighbours = (countryId: number | bigint, neighbourIds: Array<number | bigint>): string => {
	const values = neighbourIds.map(neighbourId => format(`(%1$L, %2$L)`, countryId, neighbourId));

	return format(`
		INSERT INTO neighbours(country_id, neighbour_id)
		VALUES ${values.join(', ')}
		ON CONFLICT DO NOTHING
		RETURNING *
	`);
};

export const pgsqlRemoveNeighbour = (countryId: number | bigint, neighbourId: number | bigint) =>
	format(
		`
		DELETE FROM neighbours
		WHERE country_id = %1$L
		  AND neighbour_id = %2$L
		RETURNING *
	`,
		countryId,
		neighbourId
	);

export const pgsqlGetRecursiveNeighbours = (start: number | bigint, end: number | bigint) =>
	format(
		`
		WITH RECURSIVE graph AS (
			SELECT n.country_id, n.neighbour_id FROM neighbours n WHERE n.country_id = %1$L
		UNION 
			SELECT n.country_id, n.neighbour_id
			FROM neighbours n
				INNER JOIN graph g ON n.country_id = g.neighbour_id
			WHERE n.country_id <> %2$L
		)
		SELECT * FROM graph
	`,
		start,
		end
	);
