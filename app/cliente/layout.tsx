import Link from "next/link";
import { sair } from "@/app/actions/auth";
import { NavCliente } from "@/components/cliente/NavCliente";
import { Logo } from "@/components/Logo";
import { exigirUsuario } from "@/lib/auth";
import { listarFavoritos } from "@/lib/products";

export default async function LayoutCliente({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await exigirUsuario();
  const favoritos = listarFavoritos(usuario.id);
  const inicial = usuario.nome.trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-svh bg-creme">
      <header className="sticky top-0 z-40 border-b border-cacau/8 bg-creme/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 md:px-8">
          <div className="flex items-center gap-8">
            <Logo href="/cliente" />
            <div className="hidden md:block">
              <NavCliente totalFavoritos={favoritos.length} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {usuario.perfil === "admin" && (
              <Link
                href="/admin"
                className="hidden text-[0.66rem] uppercase tracking-[0.18em] text-framboesa-escura hover:underline sm:block"
              >
                Painel admin
              </Link>
            )}
            <Link
              href="/cliente/perfil"
              className="flex items-center gap-2 rounded-full border border-cacau/10 py-1 pl-1 pr-3 transition hover:border-cacau/30"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-framboesa font-display text-sm text-creme">
                {inicial}
              </span>
              <span className="hidden text-[0.7rem] uppercase tracking-[0.14em] text-cacau/70 sm:block">
                {usuario.nome.split(" ")[0]}
              </span>
            </Link>
            <form action={sair}>
              <button
                type="submit"
                className="text-[0.66rem] uppercase tracking-[0.18em] text-cacau/50 transition hover:text-framboesa-escura"
              >
                Sair
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-cacau/8 px-4 py-2 md:hidden">
          <NavCliente totalFavoritos={favoritos.length} />
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-cacau/10 px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-cacau/40 sm:flex-row sm:items-center sm:justify-between">
          <span>Lumiê · pequenas fornadas</span>
          <span>Feito com farinha, manteiga e paciência</span>
        </div>
      </footer>
    </div>
  );
}
