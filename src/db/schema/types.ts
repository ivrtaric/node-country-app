export interface Country {
	id: number;
	name: string;
	code: string;
	code_alpha_2: string;
	code_alpha_3: string;
	flag: string | null;
}

export interface Neighbour {
	id: number;
	country_id: number;
	neighbour_id: number;
}
