import { getDb } from "./db";
import type {
  Categoria,
  CategoriaComContagem,
  FiltrosProduto,
  ProdutoComCategoria,
} from "./types";

const SELECT_PRODUTO = `
  SELECT p.*, c.nome AS categoria_nome, c.slug AS categoria_slug
    FROM produtos p
    JOIN categorias c ON c.id = p.categoria_id
`;

/** Busca sem diferenciar maiúsculas nem acentos. */
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function listarCategorias(): Categoria[] {
  return getDb()
    .prepare("SELECT * FROM categorias ORDER BY ordem ASC, nome ASC")
    .all() as Categoria[];
}

export function listarCategoriasComContagem(
  incluirInativos = false,
): CategoriaComContagem[] {
  return getDb()
    .prepare(
      `SELECT c.*, COUNT(p.id) AS total_produtos
         FROM categorias c
         LEFT JOIN produtos p
           ON p.categoria_id = c.id ${incluirInativos ? "" : "AND p.ativo = 1"}
        GROUP BY c.id
        ORDER BY c.ordem ASC, c.nome ASC`,
    )
    .all() as CategoriaComContagem[];
}

export function buscarCategoriaPorSlug(slug: string): Categoria | null {
  const linha = getDb().prepare("SELECT * FROM categorias WHERE slug = ?").get(slug);
  return (linha as Categoria | undefined) ?? null;
}

export function buscarCategoriaPorId(id: number): Categoria | null {
  const linha = getDb().prepare("SELECT * FROM categorias WHERE id = ?").get(id);
  return (linha as Categoria | undefined) ?? null;
}

export function listarProdutos(filtros: FiltrosProduto = {}): ProdutoComCategoria[] {
  const condicoes: string[] = [];
  const parametros: Record<string, unknown> = {};

  if (!filtros.incluirInativos) condicoes.push("p.ativo = 1");
  if (filtros.apenasDestaques) condicoes.push("p.destaque = 1");
  if (filtros.prontoRetirada) condicoes.push("p.pronto_retirada = 1");
  if (filtros.categoriaSlug) {
    condicoes.push("c.slug = @categoriaSlug");
    parametros.categoriaSlug = filtros.categoriaSlug;
  }

  const where = condicoes.length ? `WHERE ${condicoes.join(" AND ")}` : "";
  const ordenacao =
    filtros.ordenar === "recentes"
      ? "p.criado_em DESC, p.id DESC"
      : "p.destaque DESC, p.criado_em DESC, p.id DESC";

  let linhas = getDb()
    .prepare(
      `${SELECT_PRODUTO}
       ${where}
       ORDER BY ${ordenacao}`,
    )
    .all(parametros) as ProdutoComCategoria[];

  // A busca acontece em JS para ignorar acentos (LIKE do SQLite só cobre ASCII).
  const busca = filtros.busca?.trim();
  if (busca) {
    const alvo = normalizar(busca);
    linhas = linhas.filter((produto) =>
      normalizar(`${produto.nome} ${produto.resumo} ${produto.descricao}`).includes(alvo),
    );
  }

  return filtros.limite ? linhas.slice(0, filtros.limite) : linhas;
}

export function buscarProdutoPorSlug(slug: string): ProdutoComCategoria | null {
  const linha = getDb().prepare(`${SELECT_PRODUTO} WHERE p.slug = ?`).get(slug);
  return (linha as ProdutoComCategoria | undefined) ?? null;
}

export function buscarProdutoPorId(id: number): ProdutoComCategoria | null {
  const linha = getDb().prepare(`${SELECT_PRODUTO} WHERE p.id = ?`).get(id);
  return (linha as ProdutoComCategoria | undefined) ?? null;
}

export type DadosProduto = {
  nome: string;
  slug: string;
  categoria_id: number;
  resumo: string;
  descricao: string;
  preco_centavos: number;
  imagem_url: string;
  selo: string | null;
  destaque: number;
  ativo: number;
  pronto_retirada: number;
};

export function criarProduto(dados: DadosProduto): number {
  const resultado = getDb()
    .prepare(
      `INSERT INTO produtos
         (nome, slug, categoria_id, resumo, descricao, preco_centavos, imagem_url, selo, destaque, ativo, pronto_retirada)
       VALUES
         (@nome, @slug, @categoria_id, @resumo, @descricao, @preco_centavos, @imagem_url, @selo, @destaque, @ativo, @pronto_retirada)`,
    )
    .run(dados);
  return Number(resultado.lastInsertRowid);
}

export function atualizarProduto(id: number, dados: DadosProduto): void {
  getDb()
    .prepare(
      `UPDATE produtos SET
         nome = @nome,
         slug = @slug,
         categoria_id = @categoria_id,
         resumo = @resumo,
         descricao = @descricao,
         preco_centavos = @preco_centavos,
         imagem_url = @imagem_url,
         selo = @selo,
         destaque = @destaque,
         ativo = @ativo,
         pronto_retirada = @pronto_retirada,
         atualizado_em = datetime('now')
       WHERE id = @id`,
    )
    .run({ ...dados, id });
}

export function excluirProduto(id: number): void {
  getDb().prepare("DELETE FROM produtos WHERE id = ?").run(id);
}

export function produtoSlugEmUso(slug: string, ignorarId?: number): boolean {
  const linha = getDb()
    .prepare("SELECT id FROM produtos WHERE slug = ?")
    .get(slug) as { id: number } | undefined;
  return Boolean(linha && linha.id !== ignorarId);
}

export function resumoCatalogo() {
  const db = getDb();
  const produtos = db
    .prepare(
      "SELECT COUNT(*) AS total, COALESCE(SUM(ativo), 0) AS ativos, COALESCE(SUM(pronto_retirada), 0) AS prontos FROM produtos",
    )
    .get() as { total: number; ativos: number; prontos: number };
  const categorias = db.prepare("SELECT COUNT(*) AS total FROM categorias").get() as {
    total: number;
  };
  const clientes = db
    .prepare("SELECT COUNT(*) AS total FROM usuarios WHERE perfil = 'cliente'")
    .get() as { total: number };
  const admins = db
    .prepare("SELECT COUNT(*) AS total FROM usuarios WHERE perfil = 'admin'")
    .get() as { total: number };

  return {
    produtos: produtos.total,
    produtosAtivos: produtos.ativos,
    bolosProntos: produtos.prontos,
    categorias: categorias.total,
    clientes: clientes.total,
    admins: admins.total,
  };
}

/* ---------------------------- Categorias ---------------------------- */

export function criarCategoria(dados: {
  nome: string;
  slug: string;
  descricao: string;
  ordem: number;
}): void {
  getDb()
    .prepare(
      "INSERT INTO categorias (nome, slug, descricao, ordem) VALUES (@nome, @slug, @descricao, @ordem)",
    )
    .run(dados);
}

export function atualizarCategoria(
  id: number,
  dados: { nome: string; slug: string; descricao: string; ordem: number },
): void {
  getDb()
    .prepare(
      "UPDATE categorias SET nome = @nome, slug = @slug, descricao = @descricao, ordem = @ordem WHERE id = @id",
    )
    .run({ ...dados, id });
}

export function excluirCategoria(id: number): void {
  getDb().prepare("DELETE FROM categorias WHERE id = ?").run(id);
}

export function categoriaSlugEmUso(slug: string, ignorarId?: number): boolean {
  const linha = getDb()
    .prepare("SELECT id FROM categorias WHERE slug = ?")
    .get(slug) as { id: number } | undefined;
  return Boolean(linha && linha.id !== ignorarId);
}

export function categoriaNomeEmUso(nome: string, ignorarId?: number): boolean {
  const linha = getDb()
    .prepare("SELECT id FROM categorias WHERE nome = ? COLLATE NOCASE")
    .get(nome) as { id: number } | undefined;
  return Boolean(linha && linha.id !== ignorarId);
}

export function totalProdutosDaCategoria(id: number): number {
  const linha = getDb()
    .prepare("SELECT COUNT(*) AS total FROM produtos WHERE categoria_id = ?")
    .get(id) as { total: number };
  return linha.total;
}

/* ----------------------------- Favoritos ---------------------------- */

export function alternarFavorito(usuarioId: number, produtoId: number): boolean {
  const db = getDb();
  const existe = db
    .prepare("SELECT 1 FROM favoritos WHERE usuario_id = ? AND produto_id = ?")
    .get(usuarioId, produtoId);

  if (existe) {
    db.prepare("DELETE FROM favoritos WHERE usuario_id = ? AND produto_id = ?").run(
      usuarioId,
      produtoId,
    );
    return false;
  }

  db.prepare("INSERT INTO favoritos (usuario_id, produto_id) VALUES (?, ?)").run(
    usuarioId,
    produtoId,
  );
  return true;
}

/** Favoritos ativos: produto desativado pelo ateliê não aparece na lista. */
export function listarFavoritos(usuarioId: number): ProdutoComCategoria[] {
  return getDb()
    .prepare(
      `${SELECT_PRODUTO}
         JOIN favoritos f ON f.produto_id = p.id AND f.usuario_id = ?
        WHERE p.ativo = 1
        ORDER BY f.criado_em DESC`,
    )
    .all(usuarioId) as ProdutoComCategoria[];
}

export function idsFavoritos(usuarioId: number): Set<number> {
  const linhas = getDb()
    .prepare(
      `SELECT f.produto_id
         FROM favoritos f
         JOIN produtos p ON p.id = f.produto_id AND p.ativo = 1
        WHERE f.usuario_id = ?`,
    )
    .all(usuarioId) as { produto_id: number }[];
  return new Set(linhas.map((linha) => linha.produto_id));
}
