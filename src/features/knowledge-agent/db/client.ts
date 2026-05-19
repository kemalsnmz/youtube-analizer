import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { initSchema } from "./schema";

const DB_PATH = path.join(process.cwd(), "data", "knowledge", "knowledge.db");

// Singleton — hot-reload'da aynı bağlantıyı koru
const g = globalThis as typeof globalThis & { __knowledgeDb?: Database.Database };

export function getDb(): Database.Database {
  if (g.__knowledgeDb) return g.__knowledgeDb;

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = new Database(DB_PATH);
  initSchema(db);

  g.__knowledgeDb = db;
  return db;
}
