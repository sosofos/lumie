import type { Metadata } from "next";
import Link from "next/link";
import { Marquee } from "@/components/Marquee";
import { ProductCard, corDaCategoria } from "@/components/ProductCard";
import { exigirUsuario } from "@/lib/auth";
import { idsFavoritos, listarCategoriasComContagem, listarProdutos } from "@/lib/products";

export const metadata: Metadata = {
  title: "Minha vitrine",
};

function saudacao(): string {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export default async function PaginaCliente() {
  const usuario = await exigirUsuario();
  const categorias = listarCategoriasComContagem();
  const destaques = listarProdutos({ apenasDestaques: true, limite: 4 });
  const bolosProntos = listarProdutos({ prontoRetirada: true, limite: 3 });
  const doces = listarProdutos({ categoriaSlug: "doces-finos", limite: 8 });
  const novidades = listarProdutos({ limite: 4, ordenar: "recentes" });
  const favoritos = idsFavoritos(usuario.id);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          className="poa-dots poa-dots--largo absolute right-0 top-0 h-64 w-64 text-roxo"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-12 md:px-8 lg:pt-16">
          <p className="poa-rotulo text-framboesa-escura">
            {saudacao()}, {usuario.nome.split(" ")[0]}
          </p>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="max-w-2xl font-display text-[clamp(2.6rem,5.6vw,4.4rem)] leading-[0.95]">
              A vitrine de hoje
              <br />
              <span className="italic text-framboesa">está assim.</span>
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-cacau/65">
              Escolha devagar: filtre por família, busque por sabor e guarde nos favoritos o que
              você quer provar depois.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Link href="/cliente/catalogo" className="poa-btn poa-btn--primario poa-btn--mini">
              Abrir a vitrine completa
            </Link>
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/cliente/catalogo?categoria=${categoria.slug}`}
                className={`poa-tag border-transparent ${corDaCategoria(categoria.slug)}`}
              >
                {categoria.nome}
                <span className="ml-2 opacity-60">{categoria.total_produtos}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Marquee
        tom="pistache"
        itens={["saindo do forno", "doces feitos à mão", "bolos prontos hoje", "frutas da estação"]}
      />

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="poa-rotulo text-framboesa-escura">Escolhas da casa</p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,3.2vw,2.6rem)] leading-tight">
              Destaques da semana
            </h2>
          </div>
          <Link
            href="/cliente/catalogo?destaques=1"
            className="text-[0.68rem] uppercase tracking-[0.2em] text-cacau/55 hover:text-framboesa"
          >
            Ver todos os destaques →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destaques.map((produto) => (
            <ProductCard
              key={produto.id}
              produto={produto}
              favorito={favoritos.has(produto.id)}
              mostrarFavorito
              destino="/cliente"
            />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-amarelo-claro">
        <div className="poa-dots poa-dots--largo absolute inset-0 text-caramelo/20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8">
          <div className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="poa-rotulo text-caramelo">Sem encomenda</p>
              <h2 className="mt-3 font-display text-[clamp(1.8rem,3.2vw,2.6rem)] leading-tight">
                Bolos prontos <span className="italic text-framboesa">para hoje</span>
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-cacau/65">
                Peças inteiras que saíram do forno nesta fornada — é só retirar no ateliê.
              </p>
            </div>
            <Link
              href="/cliente/bolos-prontos"
              className="poa-btn poa-btn--escuro poa-btn--mini self-start sm:self-auto"
            >
              Ver bolos prontos
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bolosProntos.map((bolo) => (
              <ProductCard
                key={bolo.id}
                produto={bolo}
                favorito={favoritos.has(bolo.id)}
                mostrarFavorito
                destino="/cliente"
                rotuloAcao="Ver bolo"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="poa-dots poa-dots--fino absolute inset-0 text-uva/10" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8">
          <div className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="poa-rotulo text-uva">Doces da casa</p>
              <h2 className="mt-3 font-display text-[clamp(1.8rem,3.2vw,2.6rem)] leading-tight">
                Pequenas peças, <span className="italic text-framboesa">grande afeto</span>
              </h2>
            </div>
            <Link
              href="/cliente/catalogo?categoria=doces-finos"
              className="text-[0.68rem] uppercase tracking-[0.2em] text-cacau/55 hover:text-framboesa"
            >
              Ver todos os doces →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {doces.map((doce) => (
              <ProductCard
                key={doce.id}
                produto={doce}
                favorito={favoritos.has(doce.id)}
                mostrarFavorito
                destino="/cliente"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-leite">
        <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8">
          <div className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="poa-rotulo text-framboesa-escura">Recém-chegados</p>
              <h2 className="mt-3 font-display text-[clamp(1.8rem,3.2vw,2.6rem)] leading-tight">
                Últimas fornadas
              </h2>
            </div>
            <Link
              href="/cliente/catalogo"
              className="text-[0.68rem] uppercase tracking-[0.2em] text-cacau/55 hover:text-framboesa"
            >
              Ver vitrine →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {novidades.map((produto) => (
              <ProductCard
                key={produto.id}
                produto={produto}
                favorito={favoritos.has(produto.id)}
                mostrarFavorito
                destino="/cliente"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
