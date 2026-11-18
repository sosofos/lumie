import Link from "next/link";
import { Logo } from "./Logo";

type Props = {
  autenticado?: boolean;
};

export function SiteHeader({ autenticado = false }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-cacau/8 bg-creme/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 text-[0.7rem] uppercase tracking-[0.24em] text-cacau/60 md:flex">
          <Link href="/explorar" className="transition hover:text-cacau">
            Explorar
          </Link>
          <Link href="/explorar#conceito" className="transition hover:text-cacau">
            Conceito
          </Link>
          <Link href="/explorar#vitrine" className="transition hover:text-cacau">
            Vitrine
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {!autenticado && (
            <Link
              href="/admin/entrar"
              className="hidden text-[0.68rem] uppercase tracking-[0.2em] text-cacau/50 transition hover:text-cacau sm:block"
            >
              Administrativo
            </Link>
          )}
          {autenticado ? (
            <Link href="/cliente" className="poa-btn poa-btn--primario poa-btn--mini">
              Minha vitrine
            </Link>
          ) : (
            <>
              <Link href="/entrar" className="poa-btn poa-btn--fantasma poa-btn--mini hidden sm:inline-flex">
                Entrar
              </Link>
              <Link href="/cadastro" className="poa-btn poa-btn--primario poa-btn--mini">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
