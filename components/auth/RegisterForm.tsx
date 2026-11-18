"use client";

import { useActionState } from "react";
import { cadastrarCliente, type EstadoFormulario } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

const estadoInicial: EstadoFormulario = {};

export function RegisterForm({ idPrefixo = "cadastro" }: { idPrefixo?: string }) {
  const [estado, acao] = useActionState(cadastrarCliente, estadoInicial);

  return (
    <form action={acao} className="space-y-3.5" noValidate>
      {estado.erro && (
        <p
          role="alert"
          className="rounded-2xl border border-framboesa/25 bg-framboesa/8 px-4 py-3 text-sm text-framboesa-escura"
        >
          {estado.erro}
        </p>
      )}

      <div>
        <label htmlFor={`${idPrefixo}-nome`} className="poa-rotulo mb-2 block text-cacau/55">
          Nome
        </label>
        <input
          id={`${idPrefixo}-nome`}
          name="nome"
          autoComplete="name"
          required
          defaultValue={estado.valores?.nome ?? ""}
          placeholder="Como podemos te chamar?"
          className={`poa-campo ${estado.erros?.nome ? "poa-campo--erro" : ""}`}
        />
        {estado.erros?.nome && <p className="poa-erro">{estado.erros.nome}</p>}
      </div>

      <div>
        <label htmlFor={`${idPrefixo}-email`} className="poa-rotulo mb-2 block text-cacau/55">
          E-mail
        </label>
        <input
          id={`${idPrefixo}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          defaultValue={estado.valores?.email ?? ""}
          placeholder="voce@email.com"
          className={`poa-campo ${estado.erros?.email ? "poa-campo--erro" : ""}`}
        />
        {estado.erros?.email && <p className="poa-erro">{estado.erros.email}</p>}
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefixo}-senha`} className="poa-rotulo mb-2 block text-cacau/55">
            Senha
          </label>
          <input
            id={`${idPrefixo}-senha`}
            name="senha"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="mín. 8 caracteres"
            className={`poa-campo ${estado.erros?.senha ? "poa-campo--erro" : ""}`}
          />
          {estado.erros?.senha && <p className="poa-erro">{estado.erros.senha}</p>}
        </div>
        <div>
          <label
            htmlFor={`${idPrefixo}-confirmacao`}
            className="poa-rotulo mb-2 block text-cacau/55"
          >
            Confirmar
          </label>
          <input
            id={`${idPrefixo}-confirmacao`}
            name="confirmacao"
            type="password"
            autoComplete="new-password"
            required
            placeholder="repita a senha"
            className={`poa-campo ${estado.erros?.confirmacao ? "poa-campo--erro" : ""}`}
          />
          {estado.erros?.confirmacao && <p className="poa-erro">{estado.erros.confirmacao}</p>}
        </div>
      </div>

      <SubmitButton pendente="Criando conta…">Criar minha conta</SubmitButton>
    </form>
  );
}
