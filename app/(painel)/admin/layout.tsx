import Link from "next/link";
import { sair } from "@/app/actions/auth";
import { MenuAdmin } from "@/components/admin/MenuAdmin";
import { Logo } from "@/components/Logo";
import { exigirAdmin } from "@/lib/auth";

export default async function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await exigirAdmin();

  return (
    <div className="min-h-svh bg-creme lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="relative overflow-hidden bg-cacau px-5 py-6 text-creme lg:min-h-svh lg:px-5 lg:py-8">
        <div className="poa-dots poa-dots--grosso absolute inset-0 text-creme/8" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 lg:h-full">
          <div className="flex items-center justify-between">
            <Logo href="/admin" tom="claro" />
            <Link
              href="/cliente"
              className="text-[0.6rem] uppercase tracking-[0.18em] text-creme/50 hover:text-creme lg:hidden"
            >
              Ver site
            </Link>
          </div>

          <div className="hidden lg:block">
            <p className="poa-rotulo text-[0.58rem] text-creme/35">Painel administrativo</p>
          </div>

          <MenuAdmin />

          <div className="mt-auto hidden space-y-4 border-t border-creme/10 pt-5 lg:block">
            <Link
              href="/cliente"
              className="block text-[0.66rem] uppercase tracking-[0.18em] text-creme/55 hover:text-creme"
            >
              Ver site como cliente →
            </Link>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-creme/90">{usuario.nome}</p>
                <p className="truncate text-[0.65rem] text-creme/45">{usuario.email}</p>
              </div>
              <form action={sair}>
                <button
                  type="submit"
                  className="rounded-full border border-creme/25 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.16em] text-creme/70 transition hover:border-creme hover:text-creme"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-cacau/10 px-5 py-3 lg:hidden">
          <span className="text-[0.62rem] uppercase tracking-[0.2em] text-cacau/50">
            {usuario.email}
          </span>
          <form action={sair}>
            <button
              type="submit"
              className="text-[0.62rem] uppercase tracking-[0.18em] text-cacau/55 hover:text-framboesa-escura"
            >
              Sair
            </button>
          </form>
        </div>

        <main className="min-w-0 flex-1 px-5 py-8 md:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
