"use client";

import Link from "next/link";
import { useActionState } from "react";
import { salvarCategoria, type EstadoCategoria } from "@/app/actions/categorias";
import { SubmitButton } from "@/components/SubmitButton";
import type { Categoria } from "@/lib/types";

const estadoInicial: EstadoCategoria = {};

export function CategoriaForm({ categoria }: { categoria?: Categoria }) {
  const [estado, acao] = useActionState(salvarCategoria, estadoInicial);

  return (
    <form action={acao} className="poa-card space-y-4 p-6">
      {categoria && <input type="hidden" name="id" value={categoria.id} />}

      <h2 className="font-display text-xl">
        {categoria ? `Editar “${categoria.nome}”` : "Nova categoria"}
      </h2>

      {estado.erro && (
        <p role="alert" className="rounded-xl border border-framboesa/25 bg-framboesa/8 px-3 py-2 text-sm text-framboesa-escura">
          {estado.erro}
        </p>
      )}

      <div>
        <label htmlFor="cat-nome" className="poa-rotulo mb-2 block text-cacau/55">
          Nome
        </label>
        <input
          id="cat-nome"
          name="nome"
          required
          defaultValue={categoria?.nome ?? ""}
          placeholder="Ex.: Sorvetes"
          className={`poa-campo ${estado.erros?.nome ? "poa-campo--erro" : ""}`}
        />
        {estado.erros?.nome && <p className="poa-erro">{estado.erros.nome}</p>}
      </div>

      <div>
        <label htmlFor="cat-slug" className="poa-rotulo mb-2 block text-cacau/55">
          Slug
        </label>
        <input
          id="cat-slug"
          name="slug"
          required
          defaultValue={categoria?.slug ?? ""}
          placeholder="sorvetes"
          className={`poa-campo font-mono text-sm ${estado.erros?.slug ? "poa-campo--erro" : ""}`}
        />
        {estado.erros?.slug && <p className="poa-erro">{estado.erros.slug}</p>}
      </div>

      <div>
        <label htmlFor="cat-descricao" className="poa-rotulo mb-2 block text-cacau/55">
          Descrição
        </label>
        <textarea
          id="cat-descricao"
          name="descricao"
          rows={3}
          maxLength={200}
          defaultValue={categoria?.descricao ?? ""}
          placeholder="Uma frase sobre esta família de produtos."
          className="poa-campo resize-y"
        />
      </div>

      <div>
        <label htmlFor="cat-ordem" className="poa-rotulo mb-2 block text-cacau/55">
          Ordem de exibição
        </label>
        <input
          id="cat-ordem"
          name="ordem"
          type="number"
          min={0}
          max={999}
          defaultValue={categoria?.ordem ?? 0}
          className="poa-campo"
        />
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <SubmitButton pendente="Salvando…">
          {categoria ? "Salvar categoria" : "Criar categoria"}
        </SubmitButton>
        {categoria && (
          <Link href="/admin/categorias" className="poa-btn poa-btn--fantasma w-full">
            Cancelar edição
          </Link>
        )}
      </div>
    </form>
  );
}
