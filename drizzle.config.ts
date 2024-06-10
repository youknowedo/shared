import { defineConfig } from 'drizzle-kit';

console.log(process.env.POSTGRES_URL);

export default defineConfig({
	schema: './src/lib/server/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.POSTGRES_URL ?? ''
	}
});
