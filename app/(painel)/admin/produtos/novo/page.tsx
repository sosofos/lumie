import type { Metadata } from "next";
import Link from "next/link";
import { ProdutoForm } from "@/components/admin/ProdutoForm";
import { exigirAdmin } from "@/lib/auth";
import { listarCategorias } from "@/lib/products";

export const metadata: Metadata = {
  title: "Novo produto",
  robots: { index: false, follow: false },
};

export default async function PaginaNovoProduto() {
  await exigirAdmin();

  const categorias = listarCategorias();

  return (
    <div>
      <nav className="text-[0.66rem] uppercase tracking-[0.18em] text-cacau/45">
        <Link href="/admin/produtos" className="hover:text-cacau">
          Produtos
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cacau/70">Novo</span>
      </nav>

      <h1 className="mt-4 font-display text-[clamp(2.2rem,4.4vw,3.2rem)] leading-[0.95]">
        Cadastrar <span className="italic text-framboesa">produto</span>.
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-cacau/60">
        Preencha a apresentação, escolha a família e a imagem. O produto entra na vitrine assim
        que for salvo.
      </p>

      <div className="mt-8">
        {categorias.length === 0 ? (
          <div className="poa-card p-8 text-center">
            <h2 className="font-display text-xl">Crie uma categoria primeiro</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-cacau/60">
              Todo produto pertence a uma família. Cadastre uma categoria para continuar.
            </p>
            <Link href="/admin/categorias" className="poa-btn poa-btn--primario mt-6">
              Ir para categorias
            </Link>
          </div>
        ) : (
          <ProdutoForm categorias={categorias} />
        )}
      </div>
    </div>
  );
}
