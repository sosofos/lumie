import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { usuarioAtual } from "@/lib/auth";
import { MOSTRAR_CONTAS_DEMO } from "@/lib/config";
import { CONTAS_DEMONSTRACAO } from "@/lib/seed";

export const metadata: Metadata = {
  title: "Entrar",
};

export default async function PaginaEntrar() {
  const usuario = await usuarioAtual();
  if (usuario) redirect(usuario.perfil === "admin" ? "/admin" : "/cliente");

  return (
    <AuthShell
      titulo="Entrar na vitrine"
      chamada="“Cada fornada é uma desculpa para parar e olhar com calma.”"
      rodape={
        <div className="space-y-3 text-sm text-cacau/65">
          <p>
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="poa-link text-framboesa-escura">
              Cadastre-se
            </Link>
            .
          </p>
          <p>
            É da equipe?{" "}
            <Link href="/admin/entrar" className="poa-link text-framboesa-escura">
              Acesso administrativo
            </Link>
            .
          </p>
          {MOSTRAR_CONTAS_DEMO && (
            <p className="rounded-xl bg-rosa-claro/70 px-3 py-2 text-xs">
              Demonstração:{" "}
              <strong className="font-medium">{CONTAS_DEMONSTRACAO.cliente.email}</strong> /{" "}
              <strong className="font-medium">{CONTAS_DEMONSTRACAO.cliente.senha}</strong>
            </p>
          )}
        </div>
      }
    >
      <LoginForm perfil="cliente" idPrefixo="entrar" />
    </AuthShell>
  );
}
