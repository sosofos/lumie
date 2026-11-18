"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirAdmin, exigirUsuario } from "@/lib/auth";
import { precoParaCentavos } from "@/lib/format";
import {
  alternarFavorito,
  atualizarProduto,
  buscarCategoriaPorId,
  buscarProdutoPorId,
  criarProduto,
  excluirProduto,
  produtoSlugEmUso,
} from "@/lib/products";
import { destinoInternoSeguro } from "@/lib/search-params";
import { extrairErros, schemaProduto } from "@/lib/validation";

export type EstadoProduto = {
  erro?: string;
  erros?: Record<string, string>;
};

function revalidarCatalogo(): void {
  revalidatePath("/");
  revalidatePath("/explorar");
  revalidatePath("/cliente");
  revalidatePath("/cliente/catalogo");
  revalidatePath("/cliente/bolos-prontos");
  revalidatePath("/cliente/favoritos");
  revalidatePath("/admin");
  revalidatePath("/admin/produtos");
}

export async function salvarProduto(
  _estadoAnterior: EstadoProduto,
  formData: FormData,
): Promise<EstadoProduto> {
  await exigirAdmin();

  const idBruto = formData.get("id");
  const id = idBruto ? Number(idBruto) : null;
  if (id !== null && (!Number.isInteger(id) || id <= 0)) {
    return { erro: "Produto inválido." };
  }
  if (id !== null && !buscarProdutoPorId(id)) {
    return { erro: "Produto não encontrado." };
  }

  const validado = schemaProduto.safeParse({
    nome: formData.get("nome"),
    slug: formData.get("slug"),
    categoria_id: formData.get("categoria_id"),
    resumo: formData.get("resumo"),
    descricao: formData.get("descricao"),
    preco: formData.get("preco"),
    imagem_url: formData.get("imagem_url"),
    selo: (formData.get("selo") as string | null) ?? "",
    destaque: formData.get("destaque") === "on",
    ativo: formData.get("ativo") === "on",
    pronto_retirada: formData.get("pronto_retirada") === "on",
  });

  if (!validado.success) {
    return { erros: extrairErros(validado.error) };
  }

  const centavos = precoParaCentavos(validado.data.preco);
  if (centavos === null) {
    return { erros: { preco: "Informe um preço válido, como 24,90." } };
  }

  if (produtoSlugEmUso(validado.data.slug, id ?? undefined)) {
    return { erros: { slug: "Já existe um produto com este endereço." } };
  }

  if (!buscarCategoriaPorId(validado.data.categoria_id)) {
    return { erros: { categoria_id: "Escolha uma categoria válida." } };
  }

  const dados = {
    nome: validado.data.nome,
    slug: validado.data.slug,
    categoria_id: validado.data.categoria_id,
    resumo: validado.data.resumo,
    descricao: validado.data.descricao,
    preco_centavos: centavos,
    imagem_url: validado.data.imagem_url,
    selo: validado.data.selo?.trim() ? validado.data.selo.trim() : null,
    destaque: validado.data.destaque ? 1 : 0,
    ativo: validado.data.ativo ? 1 : 0,
    pronto_retirada: validado.data.pronto_retirada ? 1 : 0,
  };

  if (id === null) {
    criarProduto(dados);
  } else {
    atualizarProduto(id, dados);
  }

  revalidarCatalogo();
  redirect(id === null ? "/admin/produtos?mensagem=criado" : "/admin/produtos?mensagem=atualizado");
}

export async function excluirProdutoAction(formData: FormData): Promise<void> {
  await exigirAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0 || !buscarProdutoPorId(id)) {
    redirect("/admin/produtos?erro=nao-encontrado");
  }

  excluirProduto(id);
  revalidarCatalogo();
  redirect("/admin/produtos?mensagem=excluido");
}

export async function alternarFavoritoAction(formData: FormData): Promise<void> {
  const usuario = await exigirUsuario();

  const produtoId = Number(formData.get("produto_id"));
  const destino = destinoInternoSeguro(formData.get("destino"));
  const produto =
    Number.isInteger(produtoId) && produtoId > 0 ? buscarProdutoPorId(produtoId) : null;

  if (!produto || produto.ativo !== 1) {
    redirect(destino);
  }

  alternarFavorito(usuario.id, produtoId);
  revalidatePath("/cliente/favoritos");
  revalidatePath("/cliente/catalogo");
  revalidatePath("/cliente");
  revalidatePath("/cliente/bolos-prontos");
  redirect(destino);
}
