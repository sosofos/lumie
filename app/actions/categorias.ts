"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirAdmin } from "@/lib/auth";
import {
  atualizarCategoria,
  buscarCategoriaPorId,
  categoriaNomeEmUso,
  categoriaSlugEmUso,
  criarCategoria,
  excluirCategoria,
  totalProdutosDaCategoria,
} from "@/lib/products";
import { extrairErros, schemaCategoria } from "@/lib/validation";

export type EstadoCategoria = {
  erro?: string;
  erros?: Record<string, string>;
};

export async function salvarCategoria(
  _estadoAnterior: EstadoCategoria,
  formData: FormData,
): Promise<EstadoCategoria> {
  await exigirAdmin();

  const idBruto = formData.get("id");
  const id = idBruto ? Number(idBruto) : null;
  if (id !== null && (!Number.isInteger(id) || id <= 0)) {
    return { erro: "Categoria inválida." };
  }
  if (id !== null && !buscarCategoriaPorId(id)) {
    return { erro: "Categoria não encontrada." };
  }

  const validado = schemaCategoria.safeParse({
    nome: formData.get("nome"),
    slug: formData.get("slug"),
    descricao: formData.get("descricao") ?? "",
    ordem: formData.get("ordem") ?? 0,
  });

  if (!validado.success) {
    return { erros: extrairErros(validado.error) };
  }

  if (categoriaNomeEmUso(validado.data.nome, id ?? undefined)) {
    return { erros: { nome: "Já existe uma categoria com este nome." } };
  }
  if (categoriaSlugEmUso(validado.data.slug, id ?? undefined)) {
    return { erros: { slug: "Já existe uma categoria com este endereço." } };
  }

  const dados = {
    nome: validado.data.nome,
    slug: validado.data.slug,
    descricao: validado.data.descricao ?? "",
    ordem: validado.data.ordem,
  };

  if (id === null) {
    criarCategoria(dados);
  } else {
    atualizarCategoria(id, dados);
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/admin/produtos");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/explorar");
  revalidatePath("/cliente");
  revalidatePath("/cliente/catalogo");
  redirect("/admin/categorias?mensagem=salvo");
}

export async function excluirCategoriaAction(formData: FormData): Promise<void> {
  await exigirAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0 || !buscarCategoriaPorId(id)) {
    redirect("/admin/categorias?erro=invalida");
  }

  if (totalProdutosDaCategoria(id) > 0) {
    redirect("/admin/categorias?erro=em-uso");
  }

  excluirCategoria(id);
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/produtos");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/explorar");
  revalidatePath("/cliente");
  revalidatePath("/cliente/catalogo");
  redirect("/admin/categorias?mensagem=excluida");
}
