import { POSTGRES_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const queryClient = postgres(POSTGRES_URL);
export const db = drizzle(queryClient, { schema });
