import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { usuarioAtual } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Criar conta",
};

export default async function PaginaCadastro() {
  const usuario = await usuarioAtual();
  if (usuario) redirect(usuario.perfil === "admin" ? "/admin" : "/cliente");

  return (
    <AuthShell
      titulo="Criar sua conta"
      chamada="“A melhor forma de escolher é poder olhar tudo com calma.”"
      rodape={
        <p className="text-sm text-cacau/65">
          Já tem conta?{" "}
          <Link href="/entrar" className="poa-link text-framboesa-escura">
            Entre por aqui
          </Link>
          .
        </p>
      }
    >
      <RegisterForm idPrefixo="cadastro-pagina" />
    </AuthShell>
  );
}
