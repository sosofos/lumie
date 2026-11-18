import Link from "next/link";
import { Logo } from "@/components/Logo";
import { IMAGENS } from "@/lib/seed";

type Props = {
  titulo: string;
  chamada: string;
  children: React.ReactNode;
  rodape?: React.ReactNode;
  tom?: "rosa" | "cacau";
  imagem?: string;
};

/** Layout compartilhado por /entrar, /cadastro e /admin/entrar. */
export function AuthShell({
  titulo,
  chamada,
  children,
  rodape,
  tom = "rosa",
  imagem = IMAGENS.hero,
}: Props) {
  const escuro = tom === "cacau";

  return (
    <div className="grid min-h-svh lg:grid-cols-[1.02fr_0.98fr]">
      <aside
        className={`relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between ${
          escuro ? "bg-cacau text-creme" : "bg-rosa-claro text-cacau"
        }`}
      >
        <div
          className={`poa-dots poa-dots--grosso absolute inset-0 ${
            escuro ? "text-creme/10" : "text-framboesa/20"
          }`}
          aria-hidden="true"
        />
        <div
          className={`poa-gira absolute -right-24 -top-24 h-72 w-72 rounded-full border ${
            escuro ? "border-creme/15" : "border-framboesa/25"
          }`}
          aria-hidden="true"
        />

        <div className="relative z-10 p-10">
          <Logo tom={escuro ? "claro" : "escuro"} />
        </div>

        <div className="relative z-10 mx-10 mb-8 overflow-hidden rounded-t-[999px] rounded-b-[2rem] border border-white/20">
          <img src={imagem} alt="" className="h-[46vh] w-full object-cover" />
        </div>

        <div className="relative z-10 px-10 pb-10">
          <p
            className={`max-w-sm font-display text-2xl leading-snug ${
              escuro ? "text-creme/90" : "text-cacau/85"
            }`}
          >
            {chamada}
          </p>
          <p
            className={`mt-4 text-[0.7rem] uppercase tracking-[0.28em] ${
              escuro ? "text-creme/45" : "text-cacau/45"
            }`}
          >
            Lumiê · padaria & confeitaria
          </p>
        </div>
      </aside>

      <main className="relative flex flex-col justify-center bg-creme px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Logo />
            <Link
              href="/"
              className="text-[0.68rem] uppercase tracking-[0.2em] text-cacau/55 hover:text-cacau"
            >
              Início
            </Link>
          </div>

          <h1 className="font-display text-[2.6rem] leading-none">{titulo}</h1>
          <div className="mt-8">{children}</div>
          {rodape && <div className="mt-8 border-t border-cacau/10 pt-6">{rodape}</div>}
        </div>
      </main>
    </div>
  );
}
