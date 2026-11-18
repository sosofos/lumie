"use client";

import { useFormStatus } from "react-dom";

type Props = {
  children: React.ReactNode;
  pendente?: string;
  className?: string;
};

export function SubmitButton({
  children,
  pendente = "Enviando…",
  className = "poa-btn poa-btn--primario w-full",
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending}>
      {pending ? pendente : children}
    </button>
  );
}
