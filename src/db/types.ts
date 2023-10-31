import { types } from 'pg';

export const initializeDatabaseTypeConverters = () => {
	// types.setTypeParser(types.builtins.INT8, value => BigInt(value));
	types.setTypeParser(types.builtins.INT8, value => {
		if (value === null) {
			return null;
		}
		const bigintValue = BigInt(value);
		return bigintValue > Number.MAX_SAFE_INTEGER ? bigintValue : parseInt(value, 10);
	});
	types.setTypeParser(types.builtins.TIMESTAMP, value => (value === null ? null : new Date(value)));
	types.setTypeParser(types.builtins.TIMESTAMPTZ, value => (value === null ? null : new Date(value)));

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	BigInt.prototype['toJSON'] = function () {
		return this.toString();
	};
};

export interface DbFunctions<Country, Neighbour> {
	getExistingCountryIds: (countryIds: Array<number | bigint>) => Promise<Array<number | bigint>>;
	getCountries: () => Promise<Array<Country>>;
	getCountryById: (id: number | bigint) => Promise<Array<Country>>;
	createCountry: (countryData: Country) => Promise<Array<Country>>;
	updateCountryById: (id: number | bigint, countryData: Partial<Country>) => Promise<Array<Country>>;
	deleteCountryById: (id: number | bigint) => Promise<Array<Country>>;
	isNeighbour: (countryId: number | bigint, neighbourId: number | bigint) => Promise<boolean>;
	addNeighbours: (countryId: number | bigint, neighbourIds: Array<number | bigint>) => Promise<Array<Neighbour>>;
	removeNeighbour: (countryId: number | bigint, neighbourId: number | bigint) => Promise<Array<Neighbour>>;
	getRecursiveNeighbours: (start: number | bigint, end: number | bigint) => Promise<Array<Neighbour>>;
}
