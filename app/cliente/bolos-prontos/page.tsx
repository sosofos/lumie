import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { exigirUsuario } from "@/lib/auth";
import { idsFavoritos, listarProdutos } from "@/lib/products";

export const metadata: Metadata = {
  title: "Bolos prontos",
  description:
    "Bolos inteiros já assados na Lumiê. Consulte a equipe sobre entrega ou retire no ateliê.",
};

export default async function PaginaBolosProntos() {
  const usuario = await exigirUsuario();
  const bolos = listarProdutos({ prontoRetirada: true });
  const favoritos = idsFavoritos(usuario.id);

  return (
    <div>
      <section className="relative overflow-hidden bg-amarelo-claro">
        <div className="poa-dots poa-dots--largo absolute inset-0 text-caramelo/20" aria-hidden="true" />
        <div className="poa-gira pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-caramelo/25" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-12 md:px-8 lg:pt-16">
          <p className="poa-rotulo text-caramelo">Bolos prontos · sem encomenda</p>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="max-w-2xl font-display text-[clamp(2.6rem,5.6vw,4.4rem)] leading-[0.95]">
              Assados hoje,
              <br />
              <span className="italic text-framboesa">prontos para levar.</span>
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-cacau/70">
              Peças inteiras que saíram do forno nesta fornada. Consulte a equipe sobre entrega ou
              retire no ateliê — sem esperar encomenda.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Link href="/cliente/catalogo?categoria=bolos" className="poa-btn poa-btn--escuro poa-btn--mini">
              Ver todos os bolos
            </Link>
            <Link href="/cliente/catalogo" className="poa-tag bg-creme/70">
              Explorar a vitrine inteira
            </Link>
            <span className="poa-tag bg-creme/70">retirada terça a sábado, 8h às 19h</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-cacau/45">
          {bolos.length} {bolos.length === 1 ? "bolo disponível" : "bolos disponíveis"} agora
        </p>

        {bolos.length === 0 ? (
          <div className="poa-card mt-6 p-10 text-center">
            <h2 className="font-display text-2xl">A fornada de hoje já saiu.</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-cacau/65">
              Nenhum bolo inteiro disponível neste momento. Enquanto isso, explore a vitrine —
              amanhã tem fornada nova.
            </p>
            <Link href="/cliente/catalogo" className="poa-btn poa-btn--primario mt-6">
              Ver a vitrine
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bolos.map((bolo) => (
              <ProductCard
                key={bolo.id}
                produto={bolo}
                favorito={favoritos.has(bolo.id)}
                mostrarFavorito
                destino="/cliente/bolos-prontos"
                rotuloAcao="Ver bolo"
              />
            ))}
          </div>
        )}

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              titulo: "Fornada do dia",
              texto: "Fornada diária, com disponibilidade exibida na vitrine e confirmada pela equipe.",
              cor: "bg-rosa-claro",
            },
            {
              titulo: "Retirada no ateliê",
              texto: "Rua das Camélias, 42 — Vila do Pão. Terça a sábado, 8h às 19h.",
              cor: "bg-roxo",
            },
            {
              titulo: "Entrega sob consulta",
              texto: "Consulte a equipe sobre disponibilidade, região atendida, taxa e prazo da entrega.",
              cor: "bg-pistache",
            },
          ].map((cartao) => (
            <article key={cartao.titulo} className={`rounded-[1.4rem] p-5 ${cartao.cor}`}>
              <h2 className="font-display text-xl">{cartao.titulo}</h2>
              <p className="mt-2 text-sm leading-relaxed text-cacau/70">{cartao.texto}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
