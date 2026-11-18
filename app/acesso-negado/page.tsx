import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { usuarioAtual } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Acesso restrito",
  robots: { index: false, follow: false },
};

export default async function PaginaAcessoNegado() {
  const usuario = await usuarioAtual();

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden px-6 py-16">
      <div className="poa-dots poa-dots--grosso absolute inset-0 text-framboesa/12" aria-hidden="true" />
      <div className="poa-card relative w-full max-w-lg p-10 text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="poa-rotulo mt-10 text-framboesa-escura">Erro 403</p>
        <h1 className="mt-4 font-display text-[2.4rem] leading-tight">
          Esta porta é só da <span className="italic text-framboesa">cozinha</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-cacau/65">
          {usuario
            ? `A conta ${usuario.email} é de cliente e não tem permissão para acessar o painel administrativo.`
            : "Você precisa de uma conta administrativa para acessar esta área."}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/cliente" className="poa-btn poa-btn--primario">
            Ir para minha vitrine
          </Link>
          <Link href="/" className="poa-btn poa-btn--fantasma">
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
