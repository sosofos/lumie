import type Database from "better-sqlite3";

/**
 * Esquema do banco de dados local (SQLite).
 * A criação é idempotente: cada inicialização do processo garante as tabelas
 * necessárias sem apagar dados existentes.
 */
export const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  senha_hash TEXT NOT NULL,
  perfil TEXT NOT NULL CHECK (perfil IN ('cliente', 'admin')),
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  ultimo_acesso_em TEXT
);

CREATE TABLE IF NOT EXISTS sessoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  expira_em INTEGER NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessoes_usuario ON sessoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_expira ON sessoes(expira_em);

CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  descricao TEXT NOT NULL DEFAULT '',
  ordem INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
  resumo TEXT NOT NULL DEFAULT '',
  descricao TEXT NOT NULL DEFAULT '',
  preco_centavos INTEGER NOT NULL CHECK (preco_centavos >= 0),
  imagem_url TEXT NOT NULL,
  selo TEXT,
  destaque INTEGER NOT NULL DEFAULT 0 CHECK (destaque IN (0, 1)),
  ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1)),
  pronto_retirada INTEGER NOT NULL DEFAULT 0 CHECK (pronto_retirada IN (0, 1)),
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);

CREATE TABLE IF NOT EXISTS favoritos (
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  produto_id INTEGER NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (usuario_id, produto_id)
);

CREATE TABLE IF NOT EXISTS configuracoes (
  chave TEXT PRIMARY KEY,
  valor TEXT NOT NULL
);
`;

/**
 * Ajustes incrementais para bancos criados por versões anteriores do esquema.
 * SQLite não tem `ADD COLUMN IF NOT EXISTS`, então checamos as colunas.
 */
export function migrarEsquema(db: Database.Database): void {
  const colunas = db.prepare("PRAGMA table_info(produtos)").all() as { name: string }[];

  if (!colunas.some((coluna) => coluna.name === "pronto_retirada")) {
    db.exec(
      "ALTER TABLE produtos ADD COLUMN pronto_retirada INTEGER NOT NULL DEFAULT 0 CHECK (pronto_retirada IN (0, 1))",
    );
  }
}
