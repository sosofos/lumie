import type { Metadata } from "next";
import Link from "next/link";
import { Marquee } from "@/components/Marquee";
import { ProductCard, corDaCategoria } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { usuarioAtual } from "@/lib/auth";
import { listarCategoriasComContagem, listarProdutos } from "@/lib/products";
import { IMAGENS } from "@/lib/seed";

export const metadata: Metadata = {
  title: "Explorar a confeitaria",
  description:
    "Conheça o conceito da Lumiê, a identidade da marca e uma prévia da vitrine de bolos, doces finos, tortas e pães artesanais.",
};

export default async function PaginaExplorar() {
  const usuario = await usuarioAtual();
  const categorias = listarCategoriasComContagem();
  const produtos = listarProdutos({});
  const bolosProntos = listarProdutos({ prontoRetirada: true, limite: 3 });

  return (
    <div>
      <SiteHeader autenticado={Boolean(usuario)} />

      <section className="relative overflow-hidden">
        <div
          className="poa-dots poa-dots--largo absolute right-0 top-0 h-full w-1/3 text-framboesa/12"
          aria-hidden="true"
        />
        <div
          className="poa-dots poa-dots--largo absolute bottom-0 left-0 h-32 w-32 text-roxo"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-end gap-10 px-5 pb-14 pt-14 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
          <div>
            <p className="poa-rotulo text-framboesa-escura">Explorar · sem pressa</p>
            <h1 className="mt-5 font-display text-[clamp(2.8rem,6.5vw,5rem)] leading-[0.92]">
              Antes de entrar,
              <br />
              <span className="italic text-framboesa">dê uma volta.</span>
            </h1>
            <p className="mt-7 max-w-xl text-[1.02rem] leading-relaxed text-cacau/70">
              A Lumiê é uma padaria com alma de confeitaria: aqui o doce é o assunto
              principal — e são muitos. Esta é a porta aberta da casa: o conceito, a identidade da
              marca e uma prévia do que espera por você na vitrine.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/cadastro" className="poa-btn poa-btn--primario">
                Criar minha conta
              </Link>
              <Link href="/entrar" className="poa-btn poa-btn--fantasma">
                Já tenho acesso
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-t-[999px] rounded-b-[2rem] border-[6px] border-creme shadow-2xl">
              <img
                src={IMAGENS.hero}
                alt="Mesa de confeitaria da Lumiê com bolo, torta e macarons"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <span className="absolute -left-4 bottom-8 hidden rounded-full bg-creme px-5 py-3 text-[0.62rem] uppercase tracking-[0.24em] text-framboesa-escura shadow-lg sm:block">
              desde 2019 · pequenas fornadas
            </span>
          </div>
        </div>
      </section>

      <Marquee
        tom="cacau"
        itens={["conceito", "identidade", "vitrine", "doces finos", "bolos prontos", "ateliê"]}
      />

      <section id="conceito" className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="poa-rotulo text-framboesa-escura">O conceito</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.05]">
              Uma confeitaria charmosa, acolhedora e <span className="italic">contemporânea</span>.
            </h2>
            <div className="mt-6 space-y-4 text-[0.98rem] leading-relaxed text-cacau/70">
              <p>
                A Lumiê reúne receitas de caderno, pequenas fornadas e doces feitos à mão. O poá
                aparece em detalhes gráficos da interface, sem ser aplicado às fotografias.
              </p>
              <p>
                É assim que pensamos a confeitaria — minimalista no gesto, generosa no detalhe.
                Tons pastéis de rosa, pistache, amarelo e lilás, tipografia elegante e alguns
                exageros bem colocados para que a vitrine nunca pareça sem graça.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                titulo: "Pastel & neutro",
                texto:
                  "Creme, rosa-quartzo, pistache, amarelo-manteiga e lilás: a paleta de uma tarde de domingo.",
                fundo: "bg-rosa-claro",
              },
              {
                titulo: "O poá como assinatura",
                texto: "As bolinhas aparecem no logo, nos papéis, nas caixas e no chão do ateliê.",
                fundo: "bg-roxo",
              },
              {
                titulo: "Maximalismo pontual",
                texto: "Um arco, uma tipografia grande, uma composição inesperada — sem exagero.",
                fundo: "bg-amarelo",
              },
              {
                titulo: "Foto em primeiro lugar",
                texto: "Cada peça é fotografada com luz natural antes de chegar à vitrine.",
                fundo: "bg-pistache",
              },
            ].map((bloco) => (
              <article
                key={bloco.titulo}
                className={`relative overflow-hidden rounded-[1.6rem] p-6 ${bloco.fundo}`}
              >
                <div className="poa-dots poa-dots--fino absolute inset-0 text-cacau/15" aria-hidden="true" />
                <h3 className="relative font-display text-xl">{bloco.titulo}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-cacau/70">{bloco.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-leite">
        <div className="poa-dots poa-dots--largo absolute inset-0 text-cacau/10" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 lg:py-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="poa-rotulo text-framboesa-escura">As famílias da casa</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.05]">
                Cinco vitrines, um <span className="italic">mesmo capricho</span>.
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href="/entrar"
                className={`group rounded-[1.4rem] p-5 transition hover:-translate-y-1 ${corDaCategoria(categoria.slug)}`}
              >
                <span className="poa-rotulo text-[0.6rem] opacity-70">
                  {String(categoria.total_produtos).padStart(2, "0")} receitas
                </span>
                <h3 className="mt-3 font-display text-2xl">{categoria.nome}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-80">{categoria.descricao}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="vitrine" className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:py-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="poa-rotulo text-framboesa-escura">Prévia da vitrine</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.05]">
              O que você encontra <span className="italic text-framboesa">ao entrar</span>.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-cacau/60">
            Esta é uma amostra pública. Na área do cliente você navega por categoria, busca por
            sabor, vê os bolos prontos de hoje e guarda os favoritos para depois.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {produtos.map((produto) => (
            <ProductCard
              key={produto.id}
              produto={produto}
              href="/entrar"
              rotuloAcao="Entrar para ver"
            />
          ))}
        </div>
      </section>

      <section className="px-5 pb-10 md:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.2rem] bg-amarelo-claro px-8 py-12 md:px-14">
          <div className="poa-dots poa-dots--grosso absolute inset-0 text-caramelo/20" aria-hidden="true" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="max-w-xl font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight">
                Bolos prontos: a fornada de hoje, sem encomenda.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-cacau/70">
                Ao entrar, a aba “Bolos prontos” mostra as peças inteiras disponíveis. Consulte a
                equipe sobre entrega ou retire no ateliê.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {bolosProntos.slice(0, 3).map((bolo) => (
                <span key={bolo.id} className="poa-tag border-transparent bg-creme/80">
                  {bolo.nome}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 md:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.2rem] bg-framboesa px-8 py-14 text-creme md:px-14">
          <div className="poa-dots poa-dots--grosso absolute inset-0 text-creme/15" aria-hidden="true" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="max-w-xl font-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight">
                Gostou da vitrine? Ela fica inteira para quem entra.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-creme/80">
                Crie sua conta em menos de um minuto e descubra cada peça com calma.
              </p>
            </div>
            <Link href="/cadastro" className="poa-btn poa-btn--claro shrink-0">
              Criar minha conta
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
