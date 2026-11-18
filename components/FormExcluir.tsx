"use client";

type Props = {
  acao: (formData: FormData) => void | Promise<void>;
  id: number;
  mensagem: string;
  children: React.ReactNode;
  className?: string;
};

/** Formulário de exclusão com confirmação explícita do usuário. */
export function FormExcluir({ acao, id, mensagem, children, className }: Props) {
  return (
    <form
      action={acao}
      onSubmit={(evento) => {
        if (!window.confirm(mensagem)) evento.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}
