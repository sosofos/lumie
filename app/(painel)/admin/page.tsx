import type { Metadata } from "next";
import Link from "next/link";
import { exigirAdmin } from "@/lib/auth";
import { formatarData, formatarPreco } from "@/lib/format";
import { listarCategoriasComContagem, listarProdutos, resumoCatalogo } from "@/lib/products";

export const metadata: Metadata = {
  title: "Painel administrativo",
  robots: { index: false, follow: false },
};

export default async function PaginaAdmin() {
  await exigirAdmin();

  const resumo = resumoCatalogo();
  const categorias = listarCategoriasComContagem(true);
  const recentes = listarProdutos({ incluirInativos: true, limite: 5, ordenar: "recentes" });
  const totalProdutos = Math.max(1, resumo.produtos);

  const cartoes = [
    {
      rotulo: "Produtos cadastrados",
      valor: resumo.produtos,
      detalhe: `${resumo.produtosAtivos} ativos no catálogo`,
      fundo: "bg-rosa-claro",
    },
    {
      rotulo: "Bolos prontos",
      valor: resumo.bolosProntos,
      detalhe: "Disponíveis para retirada hoje",
      fundo: "bg-amarelo",
    },
    {
      rotulo: "Categorias",
      valor: resumo.categorias,
      detalhe: "Famílias de produtos",
      fundo: "bg-pistache",
    },
    {
      rotulo: "Clientes",
      valor: resumo.clientes,
      detalhe: "Contas com acesso à vitrine",
      fundo: "bg-roxo",
    },
    {
      rotulo: "Administradores",
      valor: resumo.admins,
      detalhe: "Equipe com acesso ao painel",
      fundo: "bg-lavanda",
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="poa-rotulo text-framboesa-escura">Visão geral</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[0.95]">
            O ateliê em <span className="italic text-framboesa">números</span>.
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-cacau/60">
            Tudo o que está na vitrine hoje — e o que a equipe precisa ajustar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/produtos/novo" className="poa-btn poa-btn--primario poa-btn--mini">
            + Novo produto
          </Link>
          <Link href="/admin/categorias" className="poa-btn poa-btn--fantasma poa-btn--mini">
            Categorias
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cartoes.map((cartao) => (
          <article
            key={cartao.rotulo}
            className={`relative overflow-hidden rounded-[1.4rem] p-5 ${cartao.fundo}`}
          >
            <div className="poa-dots poa-dots--fino absolute inset-0 text-cacau/12" aria-hidden="true" />
            <p className="relative poa-rotulo text-[0.6rem] text-cacau/55">{cartao.rotulo}</p>
            <p className="relative mt-3 font-display text-4xl leading-none">{cartao.valor}</p>
            <p className="relative mt-2 text-xs text-cacau/55">{cartao.detalhe}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="poa-card overflow-hidden">
          <header className="flex items-center justify-between gap-3 border-b border-cacau/8 px-5 py-4">
            <h2 className="font-display text-xl">Últimos cadastros</h2>
            <Link
              href="/admin/produtos"
              className="text-[0.64rem] uppercase tracking-[0.18em] text-cacau/50 hover:text-framboesa"
            >
              Ver todos →
            </Link>
          </header>
          <div className="overflow-x-auto">
            <table className="poa-tabela">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Criado</th>
                </tr>
              </thead>
              <tbody>
                {recentes.map((produto) => (
                  <tr key={produto.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="poa-foto h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                          <img src={produto.imagem_url} alt="" className="h-full w-full object-cover" />
                        </span>
                        <Link
                          href={`/admin/produtos/${produto.id}/editar`}
                          className="font-medium hover:text-framboesa-escura"
                        >
                          {produto.nome}
                        </Link>
                      </div>
                    </td>
                    <td className="text-cacau/60">{produto.categoria_nome}</td>
                    <td className="whitespace-nowrap text-cacau/75">
                      {formatarPreco(produto.preco_centavos)}
                    </td>
                    <td>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.14em] ${
                          produto.ativo
                            ? "bg-pistache text-oliva"
                            : "bg-leite text-cacau/55"
                        }`}
                      >
                        {produto.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap text-cacau/50">{formatarData(produto.criado_em)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="poa-card p-5">
          <h2 className="font-display text-xl">Distribuição por categoria</h2>
          <p className="mt-1 text-xs text-cacau/50">Produtos cadastrados em cada família.</p>

          <ul className="mt-5 space-y-4">
            {categorias.map((categoria) => {
              const proporcao = Math.round((categoria.total_produtos / totalProdutos) * 100);
              return (
                <li key={categoria.id}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-cacau/80">{categoria.nome}</span>
                    <span className="text-cacau/50">{categoria.total_produtos}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-leite">
                    <div
                      className="h-full rounded-full bg-framboesa/70"
                      style={{ width: `${Math.min(100, Math.max(4, proporcao))}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <Link href="/admin/categorias" className="poa-btn poa-btn--fantasma poa-btn--mini mt-6 w-full">
            Gerenciar categorias
          </Link>
        </section>
      </div>
    </div>
  );
}
