// src/server/db.ts
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

export let db: Database;

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getDBConnection() {
  const dbPath = path.join(__dirname, '../../data/news.db');
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  return db;
}


export async function initDb() {
  db = await open({
    filename: path.join(__dirname, '../../data/news.db'),
    driver: sqlite3.Database,
  });
}
