import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { exigirUsuario } from "@/lib/auth";
import { idsFavoritos, listarCategoriasComContagem, listarProdutos } from "@/lib/products";
import { textoParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Vitrine",
};

type Props = {
  searchParams: Promise<{ q?: string | string[]; categoria?: string | string[]; destaques?: string | string[] }>;
};

export default async function PaginaCatalogo({ searchParams }: Props) {
  const usuario = await exigirUsuario();
  const parametros = await searchParams;
  const q = textoParam(parametros.q, 80);
  const categoria = textoParam(parametros.categoria, 60);
  const destaques = textoParam(parametros.destaques, 4);

  const categorias = listarCategoriasComContagem();
  const categoriaAtual = categorias.find((item) => item.slug === categoria) ?? null;

  const produtos = listarProdutos({
    busca: q.trim() || undefined,
    categoriaSlug: categoriaAtual?.slug,
    apenasDestaques: destaques === "1",
  });

  const favoritos = idsFavoritos(usuario.id);
  const destino = `/cliente/catalogo${categoriaAtual ? `?categoria=${categoriaAtual.slug}` : ""}`;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 lg:py-14">
      <p className="poa-rotulo text-framboesa-escura">A vitrine</p>
      <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-[clamp(2.4rem,5vw,3.8rem)] leading-[0.95]">
            {categoriaAtual ? (
              <>
                {categoriaAtual.nome}
                <span className="text-framboesa">.</span>
              </>
            ) : (
              <>
                Tudo o que saiu
                <br />
                <span className="italic text-framboesa">do forno.</span>
              </>
            )}
          </h1>
          {categoriaAtual && (
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-cacau/65">
              {categoriaAtual.descricao}
            </p>
          )}
        </div>

        <form action="/cliente/catalogo" method="get" className="flex w-full max-w-md gap-2">
          {categoriaAtual && <input type="hidden" name="categoria" value={categoriaAtual.slug} />}
          {destaques === "1" && <input type="hidden" name="destaques" value="1" />}
          <label htmlFor="busca" className="sr-only">
            Buscar por nome ou sabor
          </label>
          <input
            id="busca"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Buscar por sabor, ex.: pistache"
            className="poa-campo"
          />
          <button type="submit" className="poa-btn poa-btn--escuro shrink-0">
            Buscar
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Link
          href={`/cliente/catalogo${destaques === "1" ? "?destaques=1" : ""}`}
          className="poa-tag"
          data-ativo={!categoriaAtual}
        >
          Todas
        </Link>
        {categorias.map((item) => (
          <Link
            key={item.id}
            href={`/cliente/catalogo?categoria=${item.slug}${destaques === "1" ? "&destaques=1" : ""}`}
            className="poa-tag"
            data-ativo={categoriaAtual?.slug === item.slug}
          >
            {item.nome}
            <span className="ml-2 opacity-50">{item.total_produtos}</span>
          </Link>
        ))}
        <span className="mx-1 hidden h-5 w-px bg-cacau/15 sm:block" />
        <Link
          href={`/cliente/catalogo?${destaques === "1" ? "" : "destaques=1"}${categoriaAtual ? `${destaques === "1" ? "" : "&"}categoria=${categoriaAtual.slug}` : ""}`}
          className="poa-tag"
          data-ativo={destaques === "1"}
        >
          ★ Destaques
        </Link>
      </div>

      <p className="mt-6 text-[0.7rem] uppercase tracking-[0.2em] text-cacau/45">
        {produtos.length} {produtos.length === 1 ? "receita encontrada" : "receitas encontradas"}
        {q ? ` para “${q}”` : ""}
      </p>

      {produtos.length === 0 ? (
        <div className="poa-card mt-8 p-10 text-center">
          <h2 className="font-display text-2xl">Nada por aqui — ainda.</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-cacau/65">
            Não encontramos receitas com esses filtros. Tente outro sabor ou veja a vitrine
            inteira.
          </p>
          <Link href="/cliente/catalogo" className="poa-btn poa-btn--primario mt-6">
            Limpar filtros
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {produtos.map((produto) => (
            <ProductCard
              key={produto.id}
              produto={produto}
              favorito={favoritos.has(produto.id)}
              mostrarFavorito
              destino={destino}
            />
          ))}
        </div>
      )}
    </div>
  );
}
