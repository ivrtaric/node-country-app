export interface CreateCountryData {
	name: string;
	code: string;
	code_alpha_2: string;
	code_alpha_3: string;
	flag?: string | null;
}

export type UpdateCountryData = Partial<CreateCountryData>;

export interface Country extends CreateCountryData {
	id: number | bigint;
	name: string;
	code: string;
	code_alpha_2: string;
	code_alpha_3: string;
	flag: string | null;
}

export interface Neighbour {
	id: number | bigint;
	country_id: number | bigint;
	neighbour_id: number | bigint;
}
