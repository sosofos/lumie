import Link from "next/link";
import { PortalAuth } from "@/components/auth/PortalAuth";
import { Logo } from "@/components/Logo";
import { Marquee } from "@/components/Marquee";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { usuarioAtual } from "@/lib/auth";
import { MOSTRAR_CONTAS_DEMO } from "@/lib/config";
import { listarCategorias, listarProdutos } from "@/lib/products";
import { IMAGENS } from "@/lib/seed";

export default async function PaginaEntrada() {
  const usuario = await usuarioAtual();
  const categorias = listarCategorias();
  const destaques = listarProdutos({ apenasDestaques: true, limite: 4 });
  const bolosProntos = listarProdutos({ prontoRetirada: true, limite: 3 });
  const totalProdutos = listarProdutos({}).length;
  const totalDoces = listarProdutos({ categoriaSlug: "doces-finos" }).length;

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-40 border-b border-cacau/8 bg-creme/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <Logo />

          <nav className="hidden items-center gap-8 text-[0.7rem] uppercase tracking-[0.24em] text-cacau/60 md:flex">
            <Link href="/explorar" className="transition hover:text-cacau">
              Explorar
            </Link>
            <Link href="#vitrine" className="transition hover:text-cacau">
              Vitrine
            </Link>
            <Link href="#bolos-prontos" className="transition hover:text-cacau">
              Bolos prontos
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/entrar"
              className="hidden text-[0.66rem] uppercase tracking-[0.2em] text-cacau/50 transition hover:text-cacau sm:block"
            >
              Administrativo
            </Link>
            <Link href="/explorar" className="poa-btn poa-btn--primario poa-btn--mini">
              Explorar
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div
          className="poa-dots poa-dots--largo pointer-events-none absolute inset-y-0 left-0 w-24 text-framboesa/15 md:w-40"
          aria-hidden="true"
        />
        <div
          className="poa-dots poa-dots--largo pointer-events-none absolute right-0 top-24 h-40 w-40 text-roxo md:h-56 md:w-56"
          aria-hidden="true"
        />

        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-10 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-16">
          <div className="relative flex flex-col justify-center">
            <p className="poa-fade poa-rotulo flex items-center gap-3 text-framboesa-escura">
              <span className="inline-block h-2 w-2 rounded-full bg-framboesa" />
              ateliê de confeitaria · vila do pão
            </p>

            <h1 className="poa-fade poa-fade--1 mt-6 font-display text-[clamp(2.9rem,7.4vw,5.4rem)] leading-[0.9] tracking-[-0.03em]">
              O doce tem
              <br />
              <span className="relative inline-block italic text-framboesa">
                seus pontos
                <svg
                  viewBox="0 0 300 14"
                  className="absolute -bottom-2 left-0 h-3 w-full text-framboesa/50"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9c40-6 80 4 120-2s80-4 120 2 56-3 56-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>

            <p className="poa-fade poa-fade--2 mt-8 max-w-lg text-[1.02rem] leading-relaxed text-cacau/70">
              Na Lumiê, cada receita começa num caderno antigo e termina numa vitrine
              feita para ser olhada de perto: bolos de camadas, tortas de estação, doces finos em
              caixinhas pastel e pães de fermentação lenta. Entre, olhe com calma e escolha o seu
              ponto.
            </p>

            <div className="poa-fade poa-fade--3 mt-9 flex flex-wrap items-center gap-3">
              <Link href="/explorar" className="poa-btn poa-btn--primario">
                Explorar a confeitaria
              </Link>
              <Link href="#vitrine" className="poa-btn poa-btn--fantasma">
                Espiar a vitrine
              </Link>
            </div>

            <dl className="poa-fade poa-fade--4 mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-cacau/10 pt-6">
              <div>
                <dt className="poa-rotulo text-cacau/45">Doces</dt>
                <dd className="mt-1 font-display text-3xl">{totalDoces}</dd>
              </div>
              <div>
                <dt className="poa-rotulo text-cacau/45">Receitas</dt>
                <dd className="mt-1 font-display text-3xl">{totalProdutos}</dd>
              </div>
              <div>
                <dt className="poa-rotulo text-cacau/45">Famílias</dt>
                <dd className="mt-1 font-display text-3xl">{categorias.length}</dd>
              </div>
            </dl>

            <div className="pointer-events-none absolute -bottom-6 right-0 hidden xl:block">
              <div className="poa-flutua relative h-40 w-32 overflow-hidden rounded-t-full rounded-b-3xl border-4 border-creme shadow-xl">
                <img
                  src={IMAGENS.macarons}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="poa-dots poa-dots--grosso absolute -inset-4 rounded-[2.6rem] text-framboesa/15"
              aria-hidden="true"
            />
            <div className="poa-card relative overflow-hidden p-6 sm:p-8">
              <PortalAuth
                usuario={usuario ? { nome: usuario.nome, perfil: usuario.perfil } : null}
                mostrarContasDemo={MOSTRAR_CONTAS_DEMO}
              />
            </div>
          </div>
        </div>
      </section>

      <Marquee
        itens={[
          "bolos de camadas",
          "doces finos",
          "bolos prontos hoje",
          "tortas de estação",
          "pães de fermentação natural",
        ]}
      />

      <section id="vitrine" className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="poa-rotulo text-framboesa-escura">Um recorte da vitrine</p>
            <h2 className="mt-4 max-w-xl font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.02]">
              Algumas peças que estão <span className="italic text-framboesa">saindo do forno</span>.
            </h2>
          </div>
          <Link href="/explorar#vitrine" className="poa-btn poa-btn--fantasma self-start">
            Ver a vitrine completa
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destaques.map((produto) => (
            <ProductCard
              key={produto.id}
              produto={produto}
              href="/entrar"
              rotuloAcao="Entrar para ver"
            />
          ))}
        </div>
      </section>

      <section id="bolos-prontos" className="relative overflow-hidden bg-amarelo-claro">
        <div className="poa-dots poa-dots--largo absolute inset-0 text-caramelo/20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 lg:py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="poa-rotulo text-caramelo">Sem encomenda</p>
              <h2 className="mt-4 max-w-xl font-display text-[clamp(2rem,4vw,3rem)] leading-[1.02]">
                Bolos prontos <span className="italic text-framboesa">para levar hoje</span>.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-cacau/70">
                Peças inteiras que saíram desta fornada. Consulte a equipe sobre entrega ou retire
                no ateliê. A aba “Bolos prontos” mostra o que está disponível agora.
              </p>
            </div>
            <Link href="/explorar" className="poa-btn poa-btn--escuro self-start">
              Conhecer a casa
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bolosProntos.map((bolo) => (
              <ProductCard
                key={bolo.id}
                produto={bolo}
                href="/entrar"
                rotuloAcao="Entrar para ver"
              />
            ))}
          </div>
        </div>
      </section>

      <section id="conceito" className="relative overflow-hidden bg-leite">
        <div
          className="poa-dots poa-dots--largo absolute inset-0 text-cacau/10"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:px-8 lg:grid-cols-2 lg:py-24">
          <div className="relative">
            <div className="overflow-hidden rounded-t-[999px] rounded-b-[2rem] border-[6px] border-creme shadow-2xl">
              <img
                src={IMAGENS.atelier}
                alt="Ateliê da Lumiê"
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-3 hidden rounded-3xl bg-framboesa px-6 py-5 text-creme shadow-xl sm:block">
              <p className="font-display text-3xl leading-none">24h</p>
              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.22em] text-creme/70">
                de fermentação
              </p>
            </div>
          </div>

          <div>
            <p className="poa-rotulo text-framboesa-escura">Nosso conceito</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.03]">
              Confeitaria de ateliê, no tempo da <span className="italic">manteiga</span>.
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-cacau/70">
              Não fazemos volume. Fazemos fornadas pequenas, com massa que descansa, creme que não
              tem pressa e frutas escolhidas na feira da semana. O poá aparece como detalhe gráfico
              da casa, enquanto cada doce mantém sua fotografia limpa e natural.
            </p>

            <ul className="mt-8 space-y-5">
              {[
                {
                  titulo: "Fermentação lenta",
                  texto: "Pães e massas folhadas com 24 a 72 horas de descanso.",
                },
                {
                  titulo: "Pequenas fornadas",
                  texto: "Produzimos o que cabe na vitrine do dia — e vendemos até acabar.",
                },
                {
                  titulo: "Bolos prontos",
                  texto: "Além das encomendas, bolos inteiros saem do forno todos os dias.",
                },
              ].map((item, indice) => (
                <li key={item.titulo} className="flex gap-4">
                  <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-creme font-display text-sm text-framboesa">
                    {String(indice + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl">{item.titulo}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-cacau/65">{item.texto}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link href="/explorar" className="poa-btn poa-btn--escuro mt-9">
              Conhecer a casa
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
