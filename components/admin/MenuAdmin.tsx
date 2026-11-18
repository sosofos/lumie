"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const itens = [
  { href: "/admin", rotulo: "Visão geral", icone: "◍" },
  { href: "/admin/produtos", rotulo: "Produtos", icone: "◈" },
  { href: "/admin/categorias", rotulo: "Categorias", icone: "❖" },
  { href: "/admin/usuarios", rotulo: "Usuários", icone: "◉" },
];

export function MenuAdmin() {
  const caminho = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-1.5">
      {itens.map((item) => {
        const ativo =
          item.href === "/admin" ? caminho === "/admin" : caminho.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={ativo ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-[0.72rem] uppercase tracking-[0.16em] transition ${
              ativo
                ? "bg-creme text-cacau shadow-sm"
                : "text-creme/60 hover:bg-creme/10 hover:text-creme"
            }`}
          >
            <span aria-hidden="true" className="text-sm opacity-70">
              {item.icone}
            </span>
            {item.rotulo}
          </Link>
        );
      })}
    </nav>
  );
}
