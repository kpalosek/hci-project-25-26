import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

// Sigurnosna provjera - ako nema URL-a, baci grešku da znaš što popraviti
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

export const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client);