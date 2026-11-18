import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { excluirProdutoAction } from "@/app/actions/produtos";
import { ProdutoForm } from "@/components/admin/ProdutoForm";
import { FormExcluir } from "@/components/FormExcluir";
import { exigirAdmin } from "@/lib/auth";
import { buscarProdutoPorId, listarCategorias } from "@/lib/products";

export const metadata: Metadata = {
  title: "Editar produto",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PaginaEditarProduto({ params }: Props) {
  await exigirAdmin();

  const { id } = await params;
  const numeroId = Number(id);
  if (!Number.isInteger(numeroId) || numeroId <= 0) notFound();

  const produto = buscarProdutoPorId(numeroId);
  if (!produto) notFound();

  const categorias = listarCategorias();

  return (
    <div>
      <nav className="text-[0.66rem] uppercase tracking-[0.18em] text-cacau/45">
        <Link href="/admin/produtos" className="hover:text-cacau">
          Produtos
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cacau/70">{produto.nome}</span>
      </nav>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-[clamp(2rem,4.2vw,3rem)] leading-[0.95]">
            Editar <span className="italic text-framboesa">produto</span>.
          </h1>
          <p className="mt-3 text-sm text-cacau/60">
            Alterações aparecem imediatamente na vitrine dos clientes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/cliente/produtos/${produto.slug}`}
            className="poa-btn poa-btn--fantasma poa-btn--mini"
          >
            Ver na vitrine
          </Link>
          <FormExcluir
            acao={excluirProdutoAction}
            id={produto.id}
            mensagem={`Excluir “${produto.nome}”? Esta ação não pode ser desfeita.`}
            className="poa-btn poa-btn--mini border border-framboesa/30 text-framboesa hover:bg-framboesa hover:text-creme"
          >
            Excluir
          </FormExcluir>
        </div>
      </div>

      <div className="mt-8">
        <ProdutoForm categorias={categorias} produto={produto} />
      </div>
    </div>
  );
}
