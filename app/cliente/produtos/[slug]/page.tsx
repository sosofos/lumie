import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoritoBotao } from "@/components/FavoritoBotao";
import { ProductCard } from "@/components/ProductCard";
import { exigirUsuario } from "@/lib/auth";
import { formatarPreco } from "@/lib/format";
import {
  buscarProdutoPorSlug,
  idsFavoritos,
  listarProdutos,
} from "@/lib/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const produto = buscarProdutoPorSlug(slug);
  if (!produto) return { title: "Produto não encontrado" };
  return {
    title: produto.nome,
    description: produto.resumo,
  };
}

export default async function PaginaProduto({ params }: Props) {
  const usuario = await exigirUsuario();
  const { slug } = await params;

  const produto = buscarProdutoPorSlug(slug);
  if (!produto || produto.ativo !== 1) notFound();

  const favoritos = idsFavoritos(usuario.id);
  const relacionadas = listarProdutos({ categoriaSlug: produto.categoria_slug, limite: 5 }).filter(
    (item) => item.id !== produto.id,
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 lg:py-12">
      <nav aria-label="Trilha de navegação" className="text-[0.68rem] uppercase tracking-[0.2em] text-cacau/45">
        <Link href="/cliente/catalogo" className="hover:text-cacau">
          Vitrine
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/cliente/catalogo?categoria=${produto.categoria_slug}`} className="hover:text-cacau">
          {produto.categoria_nome}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cacau/70">{produto.nome}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="relative">
          <div
            className="poa-dots poa-dots--grosso absolute -inset-3 rounded-[2.4rem] text-framboesa/15"
            aria-hidden="true"
          />
          <div className="poa-foto relative aspect-[4/5] overflow-hidden rounded-[2rem] border-[6px] border-creme shadow-xl">
            <img
              src={produto.imagem_url}
              alt={produto.nome}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-3">
            <span className="poa-rotulo text-framboesa-escura">{produto.categoria_nome}</span>
            {produto.selo && <span className="poa-selo">{produto.selo}</span>}
            {produto.pronto_retirada === 1 && (
              <span className="rounded-full bg-amarelo px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-cacau">
                Pronto hoje
              </span>
            )}
            {produto.destaque === 1 && (
              <span className="rounded-full bg-cacau px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-creme">
                Destaque
              </span>
            )}
          </div>

          <h1 className="mt-5 font-display text-[clamp(2.4rem,4.6vw,3.8rem)] leading-[0.95]">
            {produto.nome}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-cacau/75">{produto.resumo}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-leite p-4">
              <h2 className="poa-rotulo text-cacau/60">Retirada</h2>
              <p className="mt-2 text-sm leading-relaxed text-cacau/70">
                No ateliê, na Rua das Camélias, 42 — Vila do Pão.
              </p>
            </div>
            <div className="rounded-2xl bg-amarelo-claro p-4">
              <h2 className="poa-rotulo text-caramelo">Entrega sob consulta</h2>
              <p className="mt-2 text-sm leading-relaxed text-cacau/70">
                Confirme com a equipe a região atendida, a taxa e o prazo. Esta vitrine não finaliza pedidos.
              </p>
            </div>
          </div>

          <div className="mt-7 flex items-baseline gap-3 border-y border-cacau/10 py-5">
            <span className="font-display text-4xl text-framboesa-escura">
              {formatarPreco(produto.preco_centavos)}
            </span>
            <span className="text-[0.66rem] uppercase tracking-[0.2em] text-cacau/45">
              por porção · retirada no ateliê
            </span>
          </div>

          <p className="mt-6 whitespace-pre-line leading-relaxed text-cacau/70">
            {produto.descricao}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <FavoritoBotao
              produtoId={produto.id}
              produtoNome={produto.nome}
              favorito={favoritos.has(produto.id)}
              destino={`/cliente/produtos/${produto.slug}`}
              variacao="texto"
            />
            <Link href="/cliente/catalogo" className="poa-btn poa-btn--fantasma w-full">
              Continuar explorando
            </Link>
          </div>

          <dl className="mt-9 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="poa-rotulo text-cacau/45">Produção</dt>
              <dd className="mt-1 text-cacau/75">Pequenas fornadas, todos os dias</dd>
            </div>
            <div>
              <dt className="poa-rotulo text-cacau/45">Conservação</dt>
              <dd className="mt-1 text-cacau/75">Geladeira, consumir em até 3 dias</dd>
            </div>
          </dl>
        </div>
      </div>

      {relacionadas.length > 0 && (
        <section className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(1.8rem,3vw,2.4rem)]">
              Também da família <span className="italic text-framboesa">{produto.categoria_nome}</span>
            </h2>
            <Link
              href={`/cliente/catalogo?categoria=${produto.categoria_slug}`}
              className="text-[0.68rem] uppercase tracking-[0.2em] text-cacau/55 hover:text-framboesa"
            >
              Ver tudo →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relacionadas.slice(0, 4).map((item) => (
              <ProductCard
                key={item.id}
                produto={item}
                favorito={favoritos.has(item.id)}
                mostrarFavorito
                destino={`/cliente/produtos/${item.slug}`}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
