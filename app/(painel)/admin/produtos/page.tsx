import type { Metadata } from "next";
import Link from "next/link";
import { excluirProdutoAction } from "@/app/actions/produtos";
import { Aviso } from "@/components/admin/Aviso";
import { FormExcluir } from "@/components/FormExcluir";
import { exigirAdmin } from "@/lib/auth";
import { formatarData, formatarPreco } from "@/lib/format";
import { listarCategoriasComContagem, listarProdutos } from "@/lib/products";
import { textoParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Produtos",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{
    mensagem?: string | string[];
    erro?: string | string[];
    q?: string | string[];
    categoria?: string | string[];
  }>;
};

export default async function PaginaAdminProdutos({ searchParams }: Props) {
  await exigirAdmin();

  const parametros = await searchParams;
  const mensagem = textoParam(parametros.mensagem, 40);
  const erro = textoParam(parametros.erro, 40);
  const q = textoParam(parametros.q, 80);
  const categoria = textoParam(parametros.categoria, 60);

  const categorias = listarCategoriasComContagem(true);
  const categoriaAtual = categorias.find((item) => item.slug === categoria) ?? null;
  const produtos = listarProdutos({
    incluirInativos: true,
    busca: q.trim() || undefined,
    categoriaSlug: categoriaAtual?.slug,
  });

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="poa-rotulo text-framboesa-escura">Catálogo</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[0.95]">
            Produtos <span className="italic text-framboesa">da vitrine</span>.
          </h1>
          <p className="mt-3 text-sm text-cacau/60">
            {produtos.length} {produtos.length === 1 ? "produto" : "produtos"} listados
            {categoriaAtual ? ` em ${categoriaAtual.nome}` : ""}
            {q ? ` para “${q}”` : ""}.
          </p>
        </div>
        <Link href="/admin/produtos/novo" className="poa-btn poa-btn--primario self-start">
          + Novo produto
        </Link>
      </div>

      <div className="mt-6">
        <Aviso mensagem={mensagem} erro={erro} />
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <form action="/admin/produtos" method="get" className="flex w-full gap-2 xl:max-w-md">
          {categoriaAtual && <input type="hidden" name="categoria" value={categoriaAtual.slug} />}
          <label htmlFor="busca-admin" className="sr-only">
            Buscar produtos
          </label>
          <input
            id="busca-admin"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Buscar por nome ou descrição"
            className="poa-campo"
          />
          <button type="submit" className="poa-btn poa-btn--escuro shrink-0">
            Buscar
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/produtos${q ? `?q=${encodeURIComponent(q)}` : ""}`}
            className="poa-tag"
            data-ativo={!categoriaAtual}
          >
            Todas
          </Link>
          {categorias.map((item) => (
            <Link
              key={item.id}
              href={`/admin/produtos?categoria=${item.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className="poa-tag"
              data-ativo={categoriaAtual?.slug === item.slug}
            >
              {item.nome}
            </Link>
          ))}
        </div>
      </div>

      <section className="poa-card mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="poa-tabela min-w-[680px]">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th className="hidden lg:table-cell">Destaque</th>
                <th>Status</th>
                <th className="hidden 2xl:table-cell">Atualizado</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cacau/55">
                    Nenhum produto encontrado com esses filtros.
                  </td>
                </tr>
              )}
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="poa-foto h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                        <img src={produto.imagem_url} alt="" className="h-full w-full object-cover" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{produto.nome}</p>
                        <p className="truncate text-xs text-cacau/45">/{produto.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap text-cacau/60">{produto.categoria_nome}</td>
                  <td className="whitespace-nowrap text-cacau/75">
                    {formatarPreco(produto.preco_centavos)}
                  </td>
                  <td className="hidden lg:table-cell">{produto.destaque ? <span className="text-framboesa">★</span> : <span className="text-cacau/25">—</span>}</td>
                  <td>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.14em] ${
                          produto.ativo ? "bg-pistache text-oliva" : "bg-leite text-cacau/55"
                        }`}
                      >
                        {produto.ativo ? "Ativo" : "Inativo"}
                      </span>
                      {produto.pronto_retirada === 1 && (
                        <span className="whitespace-nowrap rounded-full bg-amarelo px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.14em] text-cacau">
                          Pronto
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="hidden whitespace-nowrap text-cacau/50 2xl:table-cell">{formatarData(produto.atualizado_em)}</td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/produtos/${produto.id}/editar`}
                        className="rounded-full border border-cacau/15 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.14em] text-cacau/70 transition hover:border-cacau hover:text-cacau"
                      >
                        Editar
                      </Link>
                      <FormExcluir
                        acao={excluirProdutoAction}
                        id={produto.id}
                        mensagem={`Excluir “${produto.nome}”? Esta ação não pode ser desfeita.`}
                        className="rounded-full border border-framboesa/25 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.14em] text-framboesa transition hover:bg-framboesa hover:text-creme"
                      >
                        Excluir
                      </FormExcluir>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
