import Link from "next/link";

type Props = {
  href?: string;
  tom?: "escuro" | "claro";
  compacto?: boolean;
};

/** Wordmark tipográfico discreto, sem monograma ou selo. */
export function Logo({ href = "/", tom = "escuro", compacto = false }: Props) {
  const corTexto = tom === "claro" ? "text-creme" : "text-cacau";
  const corSub = tom === "claro" ? "text-creme/55" : "text-cacau/50";

  return (
    <Link href={href} className="inline-flex items-center" aria-label="Lumiê — início">
      <span className="leading-none">
        <span className={`block font-display text-[1.85rem] italic leading-none tracking-tight ${corTexto}`}>
          Lumiê
        </span>
        {!compacto && (
          <span className={`mt-1 block text-[0.52rem] uppercase tracking-[0.28em] ${corSub}`}>
            ateliê de confeitaria
          </span>
        )}
      </span>
    </Link>
  );
}
