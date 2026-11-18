import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: false },
};

export default function NaoEncontrado() {
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden px-6 py-16">
      <div className="poa-dots poa-dots--grosso absolute inset-0 text-framboesa/12" aria-hidden="true" />
      <div className="poa-card relative w-full max-w-lg p-10 text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="poa-rotulo mt-10 text-framboesa-escura">Erro 404</p>
        <h1 className="mt-4 font-display text-[2.4rem] leading-tight">
          Essa fatia já foi <span className="italic text-framboesa">servida</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-cacau/65">
          A página que você procurou não existe mais — ou nunca saiu do forno. Volte para a
          vitrine e escolha outra peça.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="poa-btn poa-btn--primario">
            Voltar ao início
          </Link>
          <Link href="/explorar" className="poa-btn poa-btn--fantasma">
            Explorar a confeitaria
          </Link>
        </div>
      </div>
    </main>
  );
}
