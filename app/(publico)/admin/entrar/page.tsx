import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { usuarioAtual } from "@/lib/auth";
import { MOSTRAR_CONTAS_DEMO } from "@/lib/config";
import { CONTAS_DEMONSTRACAO, IMAGENS } from "@/lib/seed";

export const metadata: Metadata = {
  title: "Acesso administrativo",
  robots: { index: false, follow: false },
};

export default async function PaginaEntrarAdmin() {
  const usuario = await usuarioAtual();
  if (usuario?.perfil === "admin") redirect("/admin");
  if (usuario?.perfil === "cliente") redirect("/acesso-negado");

  return (
    <AuthShell
      titulo="Acesso administrativo"
      chamada="“A vitrine é pública. A cozinha, não.”"
      tom="cacau"
      imagem={IMAGENS.atelier}
      rodape={
        <div className="space-y-3 text-sm text-cacau/65">
          <p>
            Esta área é exclusiva da equipe Lumiê e gerencia produtos, categorias e
            usuários.{" "}
            <Link href="/entrar" className="poa-link text-framboesa-escura">
              Sou cliente
            </Link>
            .
          </p>
          {MOSTRAR_CONTAS_DEMO && (
            <p className="rounded-xl bg-leite/70 px-3 py-2 text-xs">
              Demonstração: <strong className="font-medium">{CONTAS_DEMONSTRACAO.admin.email}</strong>{" "}
              / <strong className="font-medium">{CONTAS_DEMONSTRACAO.admin.senha}</strong>
            </p>
          )}
        </div>
      }
    >
      <LoginForm perfil="admin" idPrefixo="admin-entrar" />
    </AuthShell>
  );
}
