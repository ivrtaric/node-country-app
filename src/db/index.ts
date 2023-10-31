import env from 'src/env';
import { getClient as getRawClient } from 'src/db/raw';
import { getClient as getOrmClient } from 'src/db/drizzle';
import { DrizzleDbFunctions } from 'src/db/drizzle/functions';
import { RawDbFunctions } from 'src/db/raw/functions';

export const getClient = () => (env.USE_ORM ? getOrmClient() : getRawClient());

let drizzleDbFunctions: DrizzleDbFunctions | undefined;
let rawDbFunctions: RawDbFunctions | undefined;

export const getFunctions = () => {
	if (env.USE_ORM) {
		drizzleDbFunctions = drizzleDbFunctions ?? new DrizzleDbFunctions();
		return drizzleDbFunctions;
	} else {
		rawDbFunctions = rawDbFunctions ?? new RawDbFunctions();
		return rawDbFunctions;
	}
};
