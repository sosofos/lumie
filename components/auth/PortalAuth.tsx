"use client";

import Link from "next/link";
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

type UsuarioLogado = { nome: string; perfil: "cliente" | "admin" } | null;

type Props = {
  usuario: UsuarioLogado;
  mostrarContasDemo?: boolean;
};

export function PortalAuth({ usuario, mostrarContasDemo = false }: Props) {
  const [aba, setAba] = useState<"entrar" | "criar">("entrar");

  if (usuario) {
    const destino = usuario.perfil === "admin" ? "/admin" : "/cliente";
    return (
      <div className="text-center">
        <span className="poa-rotulo text-framboesa-escura">Sessão ativa</span>
        <h2 className="mt-4 font-display text-4xl leading-tight">
          Bom te ver,
          <br />
          <span className="italic text-framboesa">{usuario.nome.split(" ")[0]}</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-cacau/65">
          Sua vitrine está aberta. Continue de onde parou ou volte para descobrir as fornadas
          da semana.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link href={destino} className="poa-btn poa-btn--primario w-full">
            {usuario.perfil === "admin" ? "Ir para o painel" : "Continuar na vitrine"}
          </Link>
          <Link href="/explorar" className="poa-btn poa-btn--fantasma w-full">
            Explorar sem pressa
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <span className="poa-rotulo text-framboesa-escura">Acesso à casa</span>
        <h2 className="mt-3 font-display text-[2.1rem] leading-none">
          {aba === "entrar" ? "Entre na vitrine" : "Cadastre-se"}
        </h2>
      </div>

      <div className="mb-6 flex w-fit rounded-full border border-cacau/12 bg-creme/70 p-1">
        <button
          type="button"
          onClick={() => setAba("entrar")}
          aria-pressed={aba === "entrar"}
          className={`rounded-full px-4 py-2 text-[0.68rem] uppercase tracking-[0.16em] transition ${
            aba === "entrar" ? "bg-cacau text-creme" : "text-cacau/60 hover:text-cacau"
          }`}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => setAba("criar")}
          aria-pressed={aba === "criar"}
          className={`rounded-full px-4 py-2 text-[0.68rem] uppercase tracking-[0.16em] transition ${
            aba === "criar" ? "bg-cacau text-creme" : "text-cacau/60 hover:text-cacau"
          }`}
        >
          Criar conta
        </button>
      </div>

      {aba === "entrar" ? <LoginForm perfil="cliente" idPrefixo="portal" /> : <RegisterForm idPrefixo="portal" />}

      <div className="mt-7 space-y-3 border-t border-cacau/10 pt-5 text-xs leading-relaxed text-cacau/55">
        <p>
          Acesso administrativo é separado e destinado à equipe do ateliê.{" "}
          <Link href="/admin/entrar" className="poa-link text-framboesa-escura">
            Entrar como administrador
          </Link>
          .
        </p>
        {mostrarContasDemo && (
          <p className="rounded-xl bg-roxo-claro px-3 py-2">
            Conta de demonstração: <strong className="font-medium">cliente@maisonaurelie.com.br</strong>{" "}
            / <strong className="font-medium">AurelieCliente2026</strong>
          </p>
        )}
      </div>
    </div>
  );
}
