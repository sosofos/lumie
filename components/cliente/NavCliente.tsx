"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  totalFavoritos: number;
};

const itens = [
  { href: "/cliente", rotulo: "Descobrir" },
  { href: "/cliente/catalogo", rotulo: "Vitrine" },
  { href: "/cliente/bolos-prontos", rotulo: "Bolos prontos" },
  { href: "/cliente/favoritos", rotulo: "Favoritos" },
];

export function NavCliente({ totalFavoritos }: Props) {
  const caminho = usePathname();

  return (
    <nav className="flex items-center gap-1 overflow-x-auto">
      {itens.map((item) => {
        const ativo =
          item.href === "/cliente" ? caminho === "/cliente" : caminho.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={ativo ? "page" : undefined}
            className={`relative whitespace-nowrap rounded-full px-4 py-2 text-[0.7rem] uppercase tracking-[0.18em] transition ${
              ativo ? "bg-cacau text-creme" : "text-cacau/60 hover:bg-cacau/5 hover:text-cacau"
            }`}
          >
            {item.rotulo}
            {item.href === "/cliente/favoritos" && totalFavoritos > 0 && (
              <span
                className={`ml-2 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[0.6rem] ${
                  ativo ? "bg-creme text-cacau" : "bg-framboesa text-creme"
                }`}
              >
                {totalFavoritos}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
