import {
  randomBytes,
  scrypt as scryptCb,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;

/**
 * Gera o hash da senha no formato `scrypt$<salt-hex>$<hash-hex>`.
 * Cada senha recebe um sal aleatório exclusivo.
 */
export async function hashSenha(senha: string): Promise<string> {
  const salt = randomBytes(16);
  const derivada = await scrypt(senha, salt, KEY_LENGTH);
  return `scrypt$${salt.toString("hex")}$${derivada.toString("hex")}`;
}

/** Versão síncrona, usada apenas pela rotina de seed na inicialização. */
export function hashSenhaSync(senha: string): string {
  const salt = randomBytes(16);
  const derivada = scryptSync(senha, salt, KEY_LENGTH);
  return `scrypt$${salt.toString("hex")}$${derivada.toString("hex")}`;
}

/**
 * Compara a senha informada com o hash armazenado usando comparação em tempo
 * constante, evitando vazamento de informação por timing.
 */
export async function verificarSenha(senha: string, hash: string): Promise<boolean> {
  const partes = hash.split("$");
  if (partes.length !== 3 || partes[0] !== "scrypt") return false;

  const salt = Buffer.from(partes[1], "hex");
  const esperado = Buffer.from(partes[2], "hex");
  if (salt.length === 0 || esperado.length !== KEY_LENGTH) return false;

  const derivada = await scrypt(senha, salt, KEY_LENGTH);
  return timingSafeEqual(derivada, esperado);
}
