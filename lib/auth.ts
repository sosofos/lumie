import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "./db";
import type { Perfil, Usuario } from "./types";

export const COOKIE_SESSAO = "poa_sessao";
const DURACAO_SESSAO_S = 60 * 60 * 24 * 7; // 7 dias
const DURACAO_SESSAO_MS = DURACAO_SESSAO_S * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * O Preview do Manus roda em um iframe de outro site (HTTPS), então o cookie
 * precisa de `SameSite=None; Secure`. Em desenvolvimento local via HTTP
 * (localhost) usamos `Lax` sem `Secure`, caso contrário o navegador recusaria
 * o cookie. A decisão vem do host da requisição, nunca de NODE_ENV.
 */
async function opcoesCookie() {
  const listaHeaders = await headers();
  const host = (listaHeaders.get("host") ?? "").toLowerCase();
  const local =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]");

  return {
    httpOnly: true,
    secure: !local,
    sameSite: local ? ("lax" as const) : ("none" as const),
    path: "/",
    maxAge: DURACAO_SESSAO_S,
  };
}

/** Cria a sessão no banco e grava apenas o token bruto no cookie. */
export async function criarSessao(usuarioId: number): Promise<void> {
  const db = getDb();
  const token = randomBytes(32).toString("hex");
  const agora = Date.now();

  db.prepare("DELETE FROM sessoes WHERE expira_em < ?").run(agora);
  db.prepare(
    "INSERT INTO sessoes (token_hash, usuario_id, expira_em) VALUES (?, ?, ?)",
  ).run(hashToken(token), usuarioId, agora + DURACAO_SESSAO_MS);
  db.prepare("UPDATE usuarios SET ultimo_acesso_em = datetime('now') WHERE id = ?").run(
    usuarioId,
  );

  const jar = await cookies();
  jar.set(COOKIE_SESSAO, token, await opcoesCookie());
}

export async function encerrarSessao(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE_SESSAO)?.value;
  if (token) {
    getDb().prepare("DELETE FROM sessoes WHERE token_hash = ?").run(hashToken(token));
  }
  jar.set(COOKIE_SESSAO, "", { ...(await opcoesCookie()), maxAge: 0 });
}

const CAMPOS_USUARIO =
  "u.id, u.nome, u.email, u.perfil, u.criado_em, u.ultimo_acesso_em";

export async function usuarioAtual(): Promise<Usuario | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_SESSAO)?.value;
  if (!token) return null;

  const db = getDb();
  const linha = db
    .prepare(
      `SELECT ${CAMPOS_USUARIO}, s.expira_em AS expira_em
         FROM sessoes s
         JOIN usuarios u ON u.id = s.usuario_id
        WHERE s.token_hash = ?`,
    )
    .get(hashToken(token)) as (Usuario & { expira_em: number }) | undefined;

  if (!linha) return null;
  if (linha.expira_em < Date.now()) {
    db.prepare("DELETE FROM sessoes WHERE token_hash = ?").run(hashToken(token));
    return null;
  }

  const { expira_em: _expira, ...usuario } = linha;
  return usuario;
}

/** Garante um usuário autenticado; senão manda para o login correto. */
export async function exigirUsuario(destino = "/entrar"): Promise<Usuario> {
  const usuario = await usuarioAtual();
  if (!usuario) redirect(destino);
  return usuario;
}

/**
 * Garante perfil administrativo. Clientes autenticados recebem a página de
 * acesso negado (não apenas um redirecionamento silencioso).
 */
export async function exigirAdmin(): Promise<Usuario> {
  const usuario = await usuarioAtual();
  if (!usuario) redirect("/admin/entrar");
  if (usuario.perfil !== "admin") redirect("/acesso-negado");
  return usuario;
}

export function rotaInicial(perfil: Perfil): string {
  return perfil === "admin" ? "/admin" : "/cliente";
}
