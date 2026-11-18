const MENSAGENS: Record<string, string> = {
  criado: "Produto cadastrado com sucesso.",
  atualizado: "Produto atualizado com sucesso.",
  excluido: "Produto excluído do catálogo.",
  salvo: "Categoria salva com sucesso.",
  excluida: "Categoria excluída.",
};

const ERROS: Record<string, string> = {
  "em-uso": "Esta categoria ainda tem produtos. Mova ou exclua os produtos antes de removê-la.",
  "nao-encontrado": "Produto não encontrado.",
  invalida: "Categoria inválida.",
};

type Props = {
  mensagem?: string;
  erro?: string;
};

export function Aviso({ mensagem, erro }: Props) {
  const textoMensagem = mensagem ? MENSAGENS[mensagem] : undefined;
  const textoErro = erro ? ERROS[erro] : undefined;

  if (!textoMensagem && !textoErro) return null;

  return (
    <div
      role="status"
      className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
        textoErro
          ? "border-framboesa/25 bg-framboesa/8 text-framboesa-escura"
          : "border-oliva/30 bg-pistache/50 text-oliva"
      }`}
    >
      {textoErro ?? textoMensagem}
    </div>
  );
}
