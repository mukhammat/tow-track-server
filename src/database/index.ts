import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({
  client: pool,
  casing: 'snake_case',
  schema,
});

export type DrizzleClient = typeof db;
export type TransactionType = Parameters<Parameters<DrizzleClient['transaction']>[0]>[0];

export * from './schema';
export * from './helper';
export default db;
