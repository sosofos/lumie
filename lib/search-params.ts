/**
 * O Next entrega `searchParams` como `string | string[] | undefined`.
 * Repetir um parâmetro (`?q=a&q=b`) não pode derrubar a página, então
 * normalizamos sempre para uma string curta.
 */
export function textoParam(valor: string | string[] | undefined, limite = 120): string {
  const bruto = Array.isArray(valor) ? valor[0] : valor;
  if (typeof bruto !== "string") return "";
  return bruto.slice(0, limite);
}

/** Valida um destino interno (mesma origem) usado em redirects. */
export function destinoInternoSeguro(valor: unknown, padrao = "/cliente/catalogo"): string {
  if (typeof valor !== "string") return padrao;
  if (!valor.startsWith("/")) return padrao;
  if (valor.startsWith("//") || valor.startsWith("/\\")) return padrao;
  if (/[\s\u0000-\u001f]/.test(valor)) return padrao;
  return valor.slice(0, 300);
}
