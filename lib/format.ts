const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatarPreco(centavos: number): string {
  return moeda.format(centavos / 100);
}

/** Aceita "12,90", "12.90", "1.234,56" e devolve centavos. */
export function precoParaCentavos(entrada: string): number | null {
  const limpo = entrada.trim();
  // Aceita apenas dígitos, separador de milhar, decimal e sinal.
  if (!/^[R$\s]*\d[\d.,\s]*$/.test(limpo.replace(/^R\$\s*/i, "R$ "))) return null;
  if (!limpo) return null;

  const apenasNumeros = limpo.replace(/[^\d,.-]/g, "");
  if (!/\d/.test(apenasNumeros)) return null;

  let normalizado = apenasNumeros;
  const temVirgula = apenasNumeros.includes(",");
  if (temVirgula) {
    normalizado = apenasNumeros.replace(/\./g, "").replace(",", ".");
  }

  const valor = Number(normalizado);
  if (!Number.isFinite(valor) || valor < 0) return null;
  return Math.round(valor * 100);
}

export function centavosParaEntrada(centavos: number): string {
  return (centavos / 100).toFixed(2).replace(".", ",");
}

export function formatarData(iso: string | null): string {
  if (!iso) return "—";
  const data = new Date(iso.includes("T") ? iso : `${iso.replace(" ", "T")}Z`);
  if (Number.isNaN(data.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(data);
}

export function gerarSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
