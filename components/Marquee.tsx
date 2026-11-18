type Props = {
  itens: string[];
  tom?: "framboesa" | "cacau" | "pistache" | "lavanda";
  className?: string;
};

const fundos: Record<NonNullable<Props["tom"]>, string> = {
  framboesa: "bg-framboesa text-creme",
  cacau: "bg-cacau text-creme",
  pistache: "bg-pistache text-cacau",
  lavanda: "bg-lavanda text-cacau",
};

export function Marquee({ itens, tom = "framboesa", className = "" }: Props) {
  const sequencia = [...itens, ...itens];

  return (
    <div
      className={`overflow-hidden border-y border-cacau/10 py-3 ${fundos[tom]} ${className}`}
      aria-hidden="true"
    >
      <div className="poa-marquee">
        {[0, 1].map((metade) => (
          <div key={metade} className="flex shrink-0">
            {sequencia.map((item, indice) => (
              <span
                key={`${metade}-${indice}`}
                className="flex items-center gap-6 px-6 text-[0.68rem] uppercase tracking-[0.32em] whitespace-nowrap"
              >
                {item}
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
