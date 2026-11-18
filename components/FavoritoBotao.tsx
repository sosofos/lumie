import { alternarFavoritoAction } from "@/app/actions/produtos";

type Props = {
  produtoId: number;
  produtoNome: string;
  favorito: boolean;
  destino: string;
  variacao?: "icone" | "texto";
};

export function FavoritoBotao({
  produtoId,
  produtoNome,
  favorito,
  destino,
  variacao = "icone",
}: Props) {
  if (variacao === "texto") {
    return (
      <form action={alternarFavoritoAction}>
        <input type="hidden" name="produto_id" value={produtoId} />
        <input type="hidden" name="destino" value={destino} />
        <button
          type="submit"
          className={`poa-btn w-full ${favorito ? "poa-btn--escuro" : "poa-btn--fantasma"}`}
          aria-pressed={favorito}
        >
          <Coracao preenchido={favorito} />
          {favorito ? "Nos favoritos" : "Guardar nos favoritos"}
        </button>
      </form>
    );
  }

  return (
    <form action={alternarFavoritoAction} className="relative z-10">
      <input type="hidden" name="produto_id" value={produtoId} />
      <input type="hidden" name="destino" value={destino} />
      <button
        type="submit"
        aria-pressed={favorito}
        aria-label={favorito ? `Remover ${produtoNome} dos favoritos` : `Guardar ${produtoNome} nos favoritos`}
        title={favorito ? "Remover dos favoritos" : "Guardar nos favoritos"}
        className={`grid h-10 w-10 place-items-center rounded-full border transition ${
          favorito
            ? "border-framboesa bg-framboesa text-creme"
            : "border-cacau/10 bg-creme/90 text-cacau/70 hover:border-framboesa hover:text-framboesa"
        }`}
      >
        <Coracao preenchido={favorito} />
      </button>
    </form>
  );
}

function Coracao({ preenchido }: { preenchido: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      fill={preenchido ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20.5s-7.5-4.7-7.5-10A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.9c0 5.3-7.5 10-7.5 10Z" />
    </svg>
  );
}
