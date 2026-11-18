"use client";

import { useActionState } from "react";
import { entrarAdmin, entrarCliente, type EstadoFormulario } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

type Props = {
  perfil: "cliente" | "admin";
  idPrefixo?: string;
};

const estadoInicial: EstadoFormulario = {};

export function LoginForm({ perfil, idPrefixo = "login" }: Props) {
  const [estado, acao] = useActionState(
    perfil === "admin" ? entrarAdmin : entrarCliente,
    estadoInicial,
  );

  const idEmail = `${idPrefixo}-email`;
  const idSenha = `${idPrefixo}-senha`;

  return (
    <form action={acao} className="space-y-4" noValidate>
      {estado.erro && (
        <p
          role="alert"
          className="rounded-2xl border border-framboesa/25 bg-framboesa/8 px-4 py-3 text-sm text-framboesa-escura"
        >
          {estado.erro}
        </p>
      )}

      <div>
        <label htmlFor={idEmail} className="poa-rotulo mb-2 block text-cacau/55">
          E-mail
        </label>
        <input
          id={idEmail}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          defaultValue={estado.valores?.email ?? ""}
          placeholder={perfil === "admin" ? "nome@maisonaurelie.com.br" : "voce@email.com"}
          className={`poa-campo ${estado.erros?.email ? "poa-campo--erro" : ""}`}
        />
        {estado.erros?.email && <p className="poa-erro">{estado.erros.email}</p>}
      </div>

      <div>
        <label htmlFor={idSenha} className="poa-rotulo mb-2 block text-cacau/55">
          Senha
        </label>
        <input
          id={idSenha}
          name="senha"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={`poa-campo ${estado.erros?.senha ? "poa-campo--erro" : ""}`}
        />
        {estado.erros?.senha && <p className="poa-erro">{estado.erros.senha}</p>}
      </div>

      <SubmitButton
        className={`poa-btn w-full ${perfil === "admin" ? "poa-btn--escuro" : "poa-btn--primario"}`}
        pendente="Entrando…"
      >
        {perfil === "admin" ? "Entrar no painel" : "Entrar na vitrine"}
      </SubmitButton>
    </form>
  );
}
