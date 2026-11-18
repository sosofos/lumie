"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { salvarProduto, type EstadoProduto } from "@/app/actions/produtos";
import { SubmitButton } from "@/components/SubmitButton";
import type { Categoria, Produto } from "@/lib/types";

type Props = {
  categorias: Categoria[];
  produto?: Produto;
};

const estadoInicial: EstadoProduto = {};

export function ProdutoForm({ categorias, produto }: Props) {
  const [estado, acao] = useActionState(salvarProduto, estadoInicial);
  const [imagem, setImagem] = useState(produto?.imagem_url ?? "");
  const editando = Boolean(produto);

  const precoInicial = produto
    ? (produto.preco_centavos / 100).toFixed(2).replace(".", ",")
    : "";

  return (
    <form action={acao} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {produto && <input type="hidden" name="id" value={produto.id} />}

      {estado.erro && (
        <p
          role="alert"
          className="rounded-2xl border border-framboesa/25 bg-framboesa/8 px-4 py-3 text-sm text-framboesa-escura lg:col-span-2"
        >
          {estado.erro}
        </p>
      )}

      <div className="space-y-5">
        <div className="poa-card space-y-5 p-6">
          <h2 className="font-display text-xl">Apresentação</h2>

          <div>
            <label htmlFor="nome" className="poa-rotulo mb-2 block text-cacau/55">
              Nome do produto
            </label>
            <input
              id="nome"
              name="nome"
              required
              defaultValue={produto?.nome ?? ""}
              placeholder="Ex.: Torta de Framboesa & Pistache"
              className={`poa-campo ${estado.erros?.nome ? "poa-campo--erro" : ""}`}
            />
            {estado.erros?.nome && <p className="poa-erro">{estado.erros.nome}</p>}
          </div>

          <div>
            <label htmlFor="slug" className="poa-rotulo mb-2 block text-cacau/55">
              Endereço (slug)
            </label>
            <input
              id="slug"
              name="slug"
              required
              defaultValue={produto?.slug ?? ""}
              placeholder="torta-de-framboesa-e-pistache"
              className={`poa-campo font-mono text-sm ${estado.erros?.slug ? "poa-campo--erro" : ""}`}
            />
            <p className="mt-1 text-xs text-cacau/45">
              Letras minúsculas, números e hífens. Aparece no link do produto.
            </p>
            {estado.erros?.slug && <p className="poa-erro">{estado.erros.slug}</p>}
          </div>

          <div>
            <label htmlFor="resumo" className="poa-rotulo mb-2 block text-cacau/55">
              Resumo (uma frase)
            </label>
            <input
              id="resumo"
              name="resumo"
              required
              maxLength={160}
              defaultValue={produto?.resumo ?? ""}
              placeholder="Creme de pistache, framboesas frescas e massa sablée."
              className={`poa-campo ${estado.erros?.resumo ? "poa-campo--erro" : ""}`}
            />
            {estado.erros?.resumo && <p className="poa-erro">{estado.erros.resumo}</p>}
          </div>

          <div>
            <label htmlFor="descricao" className="poa-rotulo mb-2 block text-cacau/55">
              Descrição completa
            </label>
            <textarea
              id="descricao"
              name="descricao"
              required
              rows={7}
              defaultValue={produto?.descricao ?? ""}
              placeholder="Conte a história, os ingredientes e o melhor jeito de servir."
              className={`poa-campo resize-y ${estado.erros?.descricao ? "poa-campo--erro" : ""}`}
            />
            {estado.erros?.descricao && <p className="poa-erro">{estado.erros.descricao}</p>}
          </div>
        </div>

        <div className="poa-card space-y-5 p-6">
          <h2 className="font-display text-xl">Imagem</h2>
          <div>
            <label htmlFor="imagem_url" className="poa-rotulo mb-2 block text-cacau/55">
              URL da imagem
            </label>
            <input
              id="imagem_url"
              name="imagem_url"
              required
              value={imagem}
              onChange={(evento) => setImagem(evento.target.value)}
              placeholder="/manus-storage/... ou https://..."
              className={`poa-campo text-sm ${estado.erros?.imagem_url ? "poa-campo--erro" : ""}`}
            />
            <p className="mt-1 text-xs text-cacau/45">
              Use um caminho interno iniciado por / ou uma URL https.
            </p>
            {estado.erros?.imagem_url && <p className="poa-erro">{estado.erros.imagem_url}</p>}
          </div>

          <div className="poa-foto aspect-[4/3] overflow-hidden rounded-xl border border-cacau/10">
            {imagem ? (
              <img src={imagem} alt="Prévia da imagem do produto" className="h-full w-full object-cover" />
            ) : (
              <div className="poa-dots flex h-full items-center justify-center text-cacau/20">
                <span className="rounded-full bg-creme/80 px-4 py-2 text-xs text-cacau/50">
                  Prévia da imagem
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="poa-card space-y-5 p-6">
          <h2 className="font-display text-xl">Organização</h2>

          <div>
            <label htmlFor="categoria_id" className="poa-rotulo mb-2 block text-cacau/55">
              Categoria
            </label>
            <select
              id="categoria_id"
              name="categoria_id"
              required
              defaultValue={produto?.categoria_id ?? ""}
              className={`poa-campo ${estado.erros?.categoria_id ? "poa-campo--erro" : ""}`}
            >
              <option value="" disabled>
                Escolha uma categoria
              </option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
            {estado.erros?.categoria_id && <p className="poa-erro">{estado.erros.categoria_id}</p>}
          </div>

          <div>
            <label htmlFor="preco" className="poa-rotulo mb-2 block text-cacau/55">
              Preço (R$)
            </label>
            <input
              id="preco"
              name="preco"
              required
              inputMode="decimal"
              defaultValue={precoInicial}
              placeholder="148,00"
              className={`poa-campo ${estado.erros?.preco ? "poa-campo--erro" : ""}`}
            />
            {estado.erros?.preco && <p className="poa-erro">{estado.erros.preco}</p>}
          </div>

          <div>
            <label htmlFor="selo" className="poa-rotulo mb-2 block text-cacau/55">
              Selo (opcional)
            </label>
            <input
              id="selo"
              name="selo"
              maxLength={24}
              defaultValue={produto?.selo ?? ""}
              placeholder="Assinatura, Novo, Sazonal…"
              className="poa-campo"
            />
          </div>
        </div>

        <div className="poa-card space-y-4 p-6">
          <h2 className="font-display text-xl">Visibilidade</h2>

          <label className="flex items-start gap-3 text-sm text-cacau/75">
            <input
              type="checkbox"
              name="pronto_retirada"
              defaultChecked={produto ? produto.pronto_retirada === 1 : false}
              className="mt-0.5 h-4 w-4 accent-[#c23b5e]"
            />
            <span>
              Pronto para retirada hoje
              <span className="mt-0.5 block text-xs text-cacau/50">
                Aparece em “Bolos prontos”, a lista de peças já assadas na vitrine.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm text-cacau/75">
            <input
              type="checkbox"
              name="destaque"
              defaultChecked={produto ? produto.destaque === 1 : false}
              className="mt-0.5 h-4 w-4 accent-[#c23b5e]"
            />
            <span>
              Destacar na vitrine
              <span className="mt-0.5 block text-xs text-cacau/50">
                Aparece nas seções de destaque da área do cliente.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm text-cacau/75">
            <input
              type="checkbox"
              name="ativo"
              defaultChecked={produto ? produto.ativo === 1 : true}
              className="mt-0.5 h-4 w-4 accent-[#c23b5e]"
            />
            <span>
              Ativo no catálogo
              <span className="mt-0.5 block text-xs text-cacau/50">
                Desmarque para esconder do público sem excluir.
              </span>
            </span>
          </label>
        </div>

        <div className="space-y-3">
          <SubmitButton pendente="Salvando…">
            {editando ? "Salvar alterações" : "Cadastrar produto"}
          </SubmitButton>
          <Link href="/admin/produtos" className="poa-btn poa-btn--fantasma w-full">
            Cancelar
          </Link>
        </div>
      </div>
    </form>
  );
}
