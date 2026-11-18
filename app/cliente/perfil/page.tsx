import type { Metadata } from "next";
import Link from "next/link";
import { sair } from "@/app/actions/auth";
import { exigirUsuario } from "@/lib/auth";
import { formatarData } from "@/lib/format";
import { listarFavoritos } from "@/lib/products";

export const metadata: Metadata = {
  title: "Meu perfil",
};

export default async function PaginaPerfil() {
  const usuario = await exigirUsuario();
  const favoritos = listarFavoritos(usuario.id);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8 lg:py-14">
      <p className="poa-rotulo text-framboesa-escura">Sua conta</p>
      <h1 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,3.4rem)] leading-[0.95]">
        {usuario.nome}
      </h1>

      <div className="poa-card mt-8 divide-y divide-cacau/8">
        <div className="flex items-center justify-between gap-4 p-5">
          <span className="poa-rotulo text-cacau/45">E-mail</span>
          <span className="text-sm text-cacau/80">{usuario.email}</span>
        </div>
        <div className="flex items-center justify-between gap-4 p-5">
          <span className="poa-rotulo text-cacau/45">Perfil</span>
          <span className="text-sm text-cacau/80">
            {usuario.perfil === "admin" ? "Administrador" : "Cliente"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 p-5">
          <span className="poa-rotulo text-cacau/45">Cliente desde</span>
          <span className="text-sm text-cacau/80">{formatarData(usuario.criado_em)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 p-5">
          <span className="poa-rotulo text-cacau/45">Favoritos</span>
          <span className="text-sm text-cacau/80">
            {favoritos.length} {favoritos.length === 1 ? "peça" : "peças"}
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/cliente/favoritos" className="poa-btn poa-btn--fantasma">
          Ver favoritos
        </Link>
        <form action={sair}>
          <button type="submit" className="poa-btn poa-btn--escuro">
            Encerrar sessão
          </button>
        </form>
      </div>
    </div>
  );
}
