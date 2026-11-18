import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { SCHEMA_SQL, migrarEsquema } from "./schema";
import { seedIfNeeded } from "./seed";

const globalForDb = globalThis as unknown as {
  __maisonDb?: Database.Database;
};

export function caminhoBanco(): string {
  return process.env.MAISON_DB_PATH ?? path.join(process.cwd(), "data", "maison.db");
}

/** Mantém os dados da versão anterior do projeto, se existirem. */
function migrarArquivoLegado(arquivo: string): void {
  const legado = path.join(process.cwd(), "data", "poa.db");
  if (!fs.existsSync(arquivo) && fs.existsSync(legado)) {
    fs.copyFileSync(legado, arquivo);
  }
}

/**
 * Conexão única por processo (reaproveitada entre recarregamentos do dev
 * server). Garante o esquema e o conteúdo inicial na primeira chamada.
 */
export function getDb(): Database.Database {
  if (globalForDb.__maisonDb) return globalForDb.__maisonDb;

  const arquivo = caminhoBanco();
  fs.mkdirSync(path.dirname(arquivo), { recursive: true });
  migrarArquivoLegado(arquivo);

  const db = new Database(arquivo);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  db.exec(SCHEMA_SQL);
  migrarEsquema(db);
  seedIfNeeded(db);

  globalForDb.__maisonDb = db;
  return db;
}
