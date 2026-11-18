import { z } from "zod";

const email = z
  .string()
  .trim()
  .min(1, "Informe seu e-mail.")
  .max(160, "E-mail muito longo.")
  .pipe(z.email("Informe um e-mail válido."))
  .transform((valor) => valor.toLowerCase());

const senha = z
  .string()
  .min(8, "A senha precisa ter pelo menos 8 caracteres.")
  .max(72, "A senha pode ter no máximo 72 caracteres.");

export const schemaLogin = z.object({
  email,
  senha: z.string().min(1, "Informe sua senha."),
  perfil: z.enum(["cliente", "admin"]).default("cliente"),
});

export const schemaCadastro = z
  .object({
    nome: z
      .string()
      .trim()
      .min(2, "Digite seu nome completo.")
      .max(80, "Nome muito longo."),
    email,
    senha,
    confirmacao: z.string(),
  })
  .refine((dados) => dados.senha === dados.confirmacao, {
    message: "As senhas não conferem.",
    path: ["confirmacao"],
  });

export const slugSchema = z
  .string()
  .trim()
  .min(3, "O endereço precisa ter pelo menos 3 caracteres.")
  .max(80, "Endereço muito longo.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use apenas letras minúsculas, números e hífens.",
  );

export const schemaProduto = z.object({
  nome: z.string().trim().min(3, "Informe o nome do produto.").max(90),
  slug: slugSchema,
  categoria_id: z.coerce.number().int().positive("Escolha uma categoria."),
  resumo: z.string().trim().min(10, "Resuma o produto em uma frase.").max(160),
  descricao: z.string().trim().min(20, "Descreva o produto com mais detalhes.").max(2000),
  preco: z.string().trim().min(1, "Informe o preço."),
  imagem_url: z
    .string()
    .trim()
    .min(1, "Informe a imagem do produto.")
    .max(500)
    .refine(
      (valor) => valor.startsWith("/") || /^https:\/\/[^\s]+$/.test(valor),
      "Use um caminho iniciado por / ou uma URL https.",
    ),
  selo: z.string().trim().max(24).optional(),
  destaque: z.coerce.boolean().default(false),
  ativo: z.coerce.boolean().default(true),
  pronto_retirada: z.coerce.boolean().default(false),
});

export const schemaCategoria = z.object({
  nome: z.string().trim().min(3, "Informe o nome da categoria.").max(50),
  slug: slugSchema,
  descricao: z.string().trim().max(200).optional().default(""),
  ordem: z.coerce.number().int().min(0).max(999).default(0),
});

export type ErrosCampo = Record<string, string>;

export function extrairErros(erro: z.ZodError): ErrosCampo {
  const resultado: ErrosCampo = {};
  for (const problema of erro.issues) {
    const campo = problema.path[0]?.toString() ?? "form";
    if (!resultado[campo]) resultado[campo] = problema.message;
  }
  return resultado;
}
