import type { Metadata } from "next";
import Link from "next/link";
import { excluirCategoriaAction } from "@/app/actions/categorias";
import { Aviso } from "@/components/admin/Aviso";
import { CategoriaForm } from "@/components/admin/CategoriaForm";
import { FormExcluir } from "@/components/FormExcluir";
import { exigirAdmin } from "@/lib/auth";
import { listarCategoriasComContagem } from "@/lib/products";
import { textoParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Categorias",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ mensagem?: string | string[]; erro?: string | string[]; editar?: string | string[] }>;
};

export default async function PaginaAdminCategorias({ searchParams }: Props) {
  await exigirAdmin();

  const parametros = await searchParams;
  const mensagem = textoParam(parametros.mensagem, 40);
  const erro = textoParam(parametros.erro, 40);
  const editar = textoParam(parametros.editar, 12);

  const categorias = listarCategoriasComContagem(true);
  const idEditar = editar ? Number(editar) : null;
  const emEdicao =
    idEditar !== null && Number.isInteger(idEditar)
      ? categorias.find((categoria) => categoria.id === idEditar)
      : undefined;

  return (
    <div>
      <p className="poa-rotulo text-framboesa-escura">Organização</p>
      <h1 className="mt-3 font-display text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[0.95]">
        Famílias <span className="italic text-framboesa">de produtos</span>.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-cacau/60">
        Cada produto pertence a uma categoria. A ordem define como as famílias aparecem na
        vitrine do cliente.
      </p>

      <div className="mt-6">
        <Aviso mensagem={mensagem} erro={erro} />
      </div>

      <div className="mt-2 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="poa-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="poa-tabela min-w-[560px]">
              <thead>
                <tr>
                  <th>Ordem</th>
                  <th>Categoria</th>
                  <th>Produtos</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categorias.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-cacau/55">
                      Nenhuma categoria cadastrada ainda.
                    </td>
                  </tr>
                )}
                {categorias.map((categoria) => (
                  <tr key={categoria.id}>
                    <td className="w-16 text-cacau/45">{String(categoria.ordem).padStart(2, "0")}</td>
                    <td>
                      <p className="font-medium">{categoria.nome}</p>
                      <p className="text-xs text-cacau/45">/{categoria.slug}</p>
                      {categoria.descricao && (
                        <p className="mt-1 max-w-sm text-xs leading-relaxed text-cacau/55">
                          {categoria.descricao}
                        </p>
                      )}
                    </td>
                    <td>
                      <span className="rounded-full bg-leite px-2.5 py-1 text-[0.66rem] text-cacau/65">
                        {categoria.total_produtos}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/categorias?editar=${categoria.id}`}
                          className="rounded-full border border-cacau/15 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.14em] text-cacau/70 transition hover:border-cacau hover:text-cacau"
                        >
                          Editar
                        </Link>
                        {categoria.total_produtos > 0 ? (
                          <span
                            title="Existem produtos nesta categoria"
                            className="rounded-full border border-cacau/10 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.14em] text-cacau/30"
                          >
                            Em uso
                          </span>
                        ) : (
                          <FormExcluir
                            acao={excluirCategoriaAction}
                            id={categoria.id}
                            mensagem={`Excluir a categoria “${categoria.nome}”?`}
                            className="rounded-full border border-framboesa/25 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.14em] text-framboesa transition hover:bg-framboesa hover:text-creme"
                          >
                            Excluir
                          </FormExcluir>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <CategoriaForm key={emEdicao?.id ?? "nova"} categoria={emEdicao} />
      </div>
    </div>
  );
}
