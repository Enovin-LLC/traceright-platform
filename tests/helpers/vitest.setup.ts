import { afterAll, beforeAll } from 'vitest';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { setDb } from '../../server/db';
import path from 'path';
import fs from 'fs';

let db;
let sqlite;

beforeAll(() => {
  sqlite = new Database(':memory:');
  db = drizzle(sqlite);

  // Custom migration runner
  const migrationsFolder = path.resolve(__dirname, '../../drizzle');
  const migrationFiles = fs.readdirSync(migrationsFolder)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Ensure migrations run in order

  for (const file of migrationFiles) {
    const migrationSql = fs.readFileSync(path.join(migrationsFolder, file), 'utf8');
    sqlite.exec(migrationSql);
  }
  
  setDb(db);
});

afterAll(() => {
  sqlite.close();
});
