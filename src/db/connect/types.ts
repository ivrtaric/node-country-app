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
