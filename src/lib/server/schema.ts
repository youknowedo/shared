import { pgSchema, text, timestamp } from 'drizzle-orm/pg-core';

export const schema = pgSchema('shared');

export const users = schema.table('user', {
	id: text('id').primaryKey(),
	givenName: text('given_name').notNull(),
	surname: text('surname').notNull(),
	email: text('email').unique(),
	passwordHash: text('password_hash').notNull()
});

export const sessions = schema.table('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});
