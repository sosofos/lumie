import Link from "next/link";
import { formatarPreco } from "@/lib/format";
import type { ProdutoComCategoria } from "@/lib/types";
import { FavoritoBotao } from "./FavoritoBotao";

type Props = {
  produto: ProdutoComCategoria;
  href?: string;
  favorito?: boolean;
  destino?: string;
  mostrarFavorito?: boolean;
  rotuloAcao?: string;
};

/** Cores por família de produto — amarelo e roxo pastel entram na rotação. */
export const CORES_CATEGORIA: Record<string, string> = {
  bolos: "bg-rosa-claro text-framboesa-escura",
  tortas: "bg-amarelo text-caramelo",
  "doces-finos": "bg-roxo text-uva",
  "paes-artesanais": "bg-pistache text-oliva",
  sobremesas: "bg-lavanda text-uva",
};

export function corDaCategoria(slug: string): string {
  return CORES_CATEGORIA[slug] ?? "bg-leite text-cacau/70";
}

export function ProductCard({
  produto,
  href,
  favorito = false,
  destino = "/cliente/catalogo",
  mostrarFavorito = false,
  rotuloAcao = "Ver detalhes",
}: Props) {
  const link = href ?? `/cliente/produtos/${produto.slug}`;

  return (
    <article className="group relative flex flex-col">
      <Link
        href={link}
        className="poa-card block overflow-hidden p-3 transition-transform duration-500 hover:-translate-y-1"
      >
        <div className="poa-foto relative aspect-[4/5] overflow-hidden rounded-[1.15rem]">
          <img
            src={produto.imagem_url}
            alt={produto.nome}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          {produto.selo && <span className="poa-selo absolute left-3 top-3">{produto.selo}</span>}
          {produto.pronto_retirada === 1 && (
            <span className="absolute bottom-3 left-3 rounded-full bg-amarelo/95 px-3 py-1 text-[0.58rem] uppercase tracking-[0.18em] text-cacau">
              Pronto hoje
            </span>
          )}
          {produto.destaque === 1 && (
            <span className="absolute bottom-3 right-3 rounded-full bg-cacau/85 px-3 py-1 text-[0.58rem] uppercase tracking-[0.18em] text-creme">
              Destaque
            </span>
          )}
        </div>

        <div className="px-2 pb-2 pt-4">
          <p
            className={`inline-flex rounded-full px-2.5 py-1 text-[0.56rem] uppercase tracking-[0.18em] ${corDaCategoria(produto.categoria_slug)}`}
          >
            {produto.categoria_nome}
          </p>
          <h3 className="mt-2 font-display text-[1.35rem] leading-tight">{produto.nome}</h3>
          <p className="mt-1.5 line-clamp-2 text-[0.86rem] leading-relaxed text-cacau/60">
            {produto.resumo}
          </p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="font-display text-lg text-framboesa-escura">
              {formatarPreco(produto.preco_centavos)}
            </span>
            <span className="text-[0.62rem] uppercase tracking-[0.2em] text-cacau/45 transition group-hover:text-framboesa">
              {rotuloAcao} →
            </span>
          </div>
        </div>
      </Link>

      {mostrarFavorito && (
        <div className="absolute right-5 top-5">
          <FavoritoBotao
            produtoId={produto.id}
            produtoNome={produto.nome}
            favorito={favorito}
            destino={destino}
          />
        </div>
      )}
    </article>
  );
}
