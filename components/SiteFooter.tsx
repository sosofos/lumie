import Link from "next/link";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-cacau text-creme">
      <div className="poa-dots poa-dots--grosso absolute inset-0 text-creme/8" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <Logo tom="claro" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-creme/60">
            Ateliê de confeitaria. Pequenas fornadas, doces feitos à mão e o poá como detalhe
            gráfico da Lumiê —
            feito para ser descoberto devagar.
          </p>
        </div>

        <div>
          <h3 className="poa-rotulo text-creme/45">Navegar</h3>
          <ul className="mt-4 space-y-2 text-sm text-creme/75">
            <li>
              <Link href="/explorar" className="poa-link">
                Explorar a confeitaria
              </Link>
            </li>
            <li>
              <Link href="/entrar" className="poa-link">
                Entrar
              </Link>
            </li>
            <li>
              <Link href="/cadastro" className="poa-link">
                Criar conta
              </Link>
            </li>
            <li>
              <Link href="/admin/entrar" className="poa-link">
                Acesso administrativo
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="poa-rotulo text-creme/45">Ateliê</h3>
          <p className="mt-4 text-sm leading-relaxed text-creme/75">
            Rua das Camélias, 42 — Vila do Pão
            <br />
            Terça a sábado, 8h às 19h
            <br />
            Domingo, 8h às 13h
          </p>
          <p className="mt-4 text-sm leading-relaxed text-creme/65">
            Entrega sob consulta: confirme região, taxa e prazo com a equipe.
          </p>
          <p className="mt-3 text-sm text-creme/55">oi@maisonaurelie.com.br</p>
        </div>
      </div>

      <div className="relative border-t border-creme/10 px-6 py-6">
        <p className="mx-auto max-w-6xl text-[0.68rem] uppercase tracking-[0.24em] text-creme/40">
          © {new Date().getFullYear()} Lumiê · feito com farinha, manteiga e paciência
        </p>
      </div>
    </footer>
  );
}
