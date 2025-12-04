import { afterAll, beforeAll } from 'vitest';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { setDb } from '../../server/db';

let db;
let sqlite;

beforeAll(() => {
  sqlite = new Database(':memory:');
  db = drizzle(sqlite);
  migrate(db, { migrationsFolder: 'drizzle' });
  setDb(db);
});

afterAll(() => {
  sqlite.close();
});
