import { getDb } from "./db";
import type { Perfil, Usuario } from "./types";

export type UsuarioComHash = Usuario & { senha_hash: string };

const CAMPOS = "id, nome, email, perfil, criado_em, ultimo_acesso_em";

export function buscarUsuarioPorEmail(email: string): UsuarioComHash | null {
  const linha = getDb()
    .prepare(`SELECT ${CAMPOS}, senha_hash FROM usuarios WHERE email = ? COLLATE NOCASE`)
    .get(email);
  return (linha as UsuarioComHash | undefined) ?? null;
}

export function emailEmUso(email: string): boolean {
  const linha = getDb()
    .prepare("SELECT 1 FROM usuarios WHERE email = ? COLLATE NOCASE")
    .get(email);
  return Boolean(linha);
}

export function criarUsuario(dados: {
  nome: string;
  email: string;
  senha_hash: string;
  perfil: Perfil;
}): number {
  const resultado = getDb()
    .prepare(
      "INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES (@nome, @email, @senha_hash, @perfil)",
    )
    .run(dados);
  return Number(resultado.lastInsertRowid);
}

export function listarUsuarios(): Usuario[] {
  return getDb()
    .prepare(`SELECT ${CAMPOS} FROM usuarios ORDER BY criado_em DESC, id DESC`)
    .all() as Usuario[];
}

export function contarUsuariosPorPerfil(): { clientes: number; admins: number } {
  const db = getDb();
  const clientes = db
    .prepare("SELECT COUNT(*) AS total FROM usuarios WHERE perfil = 'cliente'")
    .get() as { total: number };
  const admins = db
    .prepare("SELECT COUNT(*) AS total FROM usuarios WHERE perfil = 'admin'")
    .get() as { total: number };
  return { clientes: clientes.total, admins: admins.total };
}
