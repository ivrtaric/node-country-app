import { integer, pgTable, serial, unique, varchar } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const Countries = pgTable('country', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	code: varchar('code', { length: 20 }).notNull(),
	code_alpha_2: varchar('code_alpha_2', { length: 2 }).notNull(),
	code_alpha_3: varchar('code_alpha_3', { length: 3 }).notNull(),
	flag: varchar('flag', { length: 255 })
});

export const Neighbours = pgTable(
	'neighbours',
	{
		id: serial('id').primaryKey(),
		country_id: integer('country_id')
			.references(() => Countries.id)
			.notNull(),
		neighbour_id: integer('neighbour_id')
			.references(() => Countries.id)
			.notNull()
	},
	t => ({
		unq_pair: unique('unq_pair').on(t.country_id, t.neighbour_id)
	})
);

export type Country = InferSelectModel<typeof Countries>;
export type NewCountry = InferInsertModel<typeof Countries>;
export type Neighbour = InferSelectModel<typeof Neighbours>;
export type NewNeighbour = InferInsertModel<typeof Neighbours>;
