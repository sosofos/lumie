"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { criarSessao, encerrarSessao, rotaInicial } from "@/lib/auth";
import { hashSenha, verificarSenha } from "@/lib/password";
import {
  bloqueado,
  limparTentativas,
  minutosRestantes,
  registrarFalha,
} from "@/lib/rate-limit";
import { emailEmUso, buscarUsuarioPorEmail, criarUsuario } from "@/lib/users";
import { extrairErros, schemaCadastro, schemaLogin } from "@/lib/validation";

export type EstadoFormulario = {
  erro?: string;
  erros?: Record<string, string>;
  valores?: Record<string, string>;
};

async function chaveLimite(prefixo: string, email: string): Promise<string> {
  const listaHeaders = await headers();
  // x-real-ip vem do proxy da plataforma; o último item do XFF é o mais
  // próximo da aplicação. O primeiro item pode ser forjado pelo cliente.
  const encadeado = listaHeaders.get("x-forwarded-for")?.split(",") ?? [];
  const ip =
    listaHeaders.get("x-real-ip")?.trim() ||
    encadeado[encadeado.length - 1]?.trim() ||
    "desconhecido";
  return `${prefixo}:${ip}:${email.toLowerCase()}`;
}

export async function entrarCliente(
  _estadoAnterior: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  return autenticar(formData, "cliente");
}

export async function entrarAdmin(
  _estadoAnterior: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  return autenticar(formData, "admin");
}

async function autenticar(
  formData: FormData,
  perfil: "cliente" | "admin",
): Promise<EstadoFormulario> {
  const dados = {
    email: formData.get("email"),
    senha: formData.get("senha"),
    perfil,
  };
  const valores = {
    email: typeof dados.email === "string" ? dados.email : "",
  };

  const validado = schemaLogin.safeParse(dados);
  if (!validado.success) {
    return { erros: extrairErros(validado.error), valores };
  }

  const chave = await chaveLimite(perfil, validado.data.email);
  if (bloqueado(chave)) {
    return {
      erro: `Muitas tentativas. Tente novamente em ${minutosRestantes(chave)} minuto(s).`,
      valores,
    };
  }

  const usuario = buscarUsuarioPorEmail(validado.data.email);
  const mensagemGenerica =
    perfil === "admin"
      ? "Credenciais administrativas inválidas."
      : "E-mail ou senha incorretos.";

  if (!usuario) {
    // Executa um hash descartável para manter o tempo de resposta constante.
    await hashSenha(validado.data.senha);
    registrarFalha(chave);
    return { erro: mensagemGenerica, valores };
  }

  const senhaCorreta = await verificarSenha(validado.data.senha, usuario.senha_hash);
  if (!senhaCorreta) {
    registrarFalha(chave);
    return { erro: mensagemGenerica, valores };
  }

  if (perfil === "admin" && usuario.perfil !== "admin") {
    registrarFalha(chave);
    return { erro: mensagemGenerica, valores };
  }

  if (perfil === "cliente" && usuario.perfil === "admin") {
    return {
      erro: "Esta conta é administrativa. Use o acesso administrativo.",
      valores,
    };
  }

  limparTentativas(chave);
  await criarSessao(usuario.id);
  redirect(rotaInicial(usuario.perfil));
}

export async function cadastrarCliente(
  _estadoAnterior: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const dados = {
    nome: formData.get("nome"),
    email: formData.get("email"),
    senha: formData.get("senha"),
    confirmacao: formData.get("confirmacao"),
  };

  const valores = {
    nome: typeof dados.nome === "string" ? dados.nome : "",
    email: typeof dados.email === "string" ? dados.email : "",
  };

  const validado = schemaCadastro.safeParse(dados);
  if (!validado.success) {
    return { erros: extrairErros(validado.error), valores };
  }

  const chave = await chaveLimite("cadastro", validado.data.email);
  if (bloqueado(chave)) {
    return {
      erro: `Muitas tentativas de cadastro. Tente novamente em ${minutosRestantes(chave)} minuto(s).`,
      valores,
    };
  }

  if (emailEmUso(validado.data.email)) {
    return {
      erros: { email: "Este e-mail já possui cadastro. Tente entrar." },
      valores,
    };
  }

  const senha_hash = await hashSenha(validado.data.senha);
  let id: number;
  try {
    id = criarUsuario({
      nome: validado.data.nome,
      email: validado.data.email,
      senha_hash,
      perfil: "cliente",
    });
  } catch (erro) {
    // Duas requisições simultâneas podem disputar o e-mail único.
    if (String(erro).includes("UNIQUE")) {
      registrarFalha(chave);
      return {
        erros: { email: "Este e-mail já possui cadastro. Tente entrar." },
        valores,
      };
    }
    throw erro;
  }

  await criarSessao(id);
  redirect("/cliente");
}

export async function sair(): Promise<void> {
  await encerrarSessao();
  redirect("/");
}
