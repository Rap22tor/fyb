// Connects to SQLite
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { initDb } from "./schema";

export type Db = Database.Database;

export function openDb(path: string): Db {
  if (path !== ":memory:") {
    mkdirSync(dirname(path), { recursive: true });
  }

  const db = new Database(path);
  db.pragma("foreign_keys = ON"); // SQLite ignores foreign keys without this
  db.pragma("journal_mode = WAL");

  // function initDb() from schema.ts:
  initDb(db);

  return db;
}