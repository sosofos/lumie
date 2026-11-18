import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { exigirUsuario } from "@/lib/auth";
import { listarFavoritos } from "@/lib/products";

export const metadata: Metadata = {
  title: "Favoritos",
};

export default async function PaginaFavoritos() {
  const usuario = await exigirUsuario();
  const favoritos = listarFavoritos(usuario.id);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 lg:py-14">
      <p className="poa-rotulo text-framboesa-escura">Sua lista</p>
      <h1 className="mt-4 font-display text-[clamp(2.4rem,5vw,3.8rem)] leading-[0.95]">
        Guardado para <span className="italic text-framboesa">depois</span>.
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-cacau/65">
        {favoritos.length === 0
          ? "Você ainda não guardou nenhuma peça. Na vitrine, toque no coração para deixar aqui."
          : `${favoritos.length} ${favoritos.length === 1 ? "peça guardada" : "peças guardadas"} para quando bater a vontade.`}
      </p>

      {favoritos.length === 0 ? (
        <div className="poa-card mt-10 p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rosa">
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              className="text-framboesa-escura"
              aria-hidden="true"
            >
              <path d="M12 20.5s-7.5-4.7-7.5-10A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.9c0 5.3-7.5 10-7.5 10Z" />
            </svg>
          </div>
          <h2 className="mt-6 font-display text-2xl">Sua lista está vazia</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-cacau/65">
            Explore a vitrine com calma e guarde o que chamou sua atenção.
          </p>
          <Link href="/cliente/catalogo" className="poa-btn poa-btn--primario mt-6">
            Ir para a vitrine
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoritos.map((produto) => (
            <ProductCard
              key={produto.id}
              produto={produto}
              favorito
              mostrarFavorito
              destino="/cliente/favoritos"
            />
          ))}
        </div>
      )}
    </div>
  );
}
