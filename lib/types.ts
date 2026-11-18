export type Perfil = "cliente" | "admin";

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
  criado_em: string;
  ultimo_acesso_em: string | null;
};

export type Categoria = {
  id: number;
  nome: string;
  slug: string;
  descricao: string;
  ordem: number;
};

export type CategoriaComContagem = Categoria & {
  total_produtos: number;
};

export type Produto = {
  id: number;
  nome: string;
  slug: string;
  categoria_id: number;
  resumo: string;
  descricao: string;
  preco_centavos: number;
  imagem_url: string;
  selo: string | null;
  destaque: number;
  ativo: number;
  pronto_retirada: number;
  criado_em: string;
  atualizado_em: string;
};

export type ProdutoComCategoria = Produto & {
  categoria_nome: string;
  categoria_slug: string;
};

export type FiltrosProduto = {
  categoriaSlug?: string;
  busca?: string;
  incluirInativos?: boolean;
  apenasDestaques?: boolean;
  prontoRetirada?: boolean;
  limite?: number;
  ordenar?: "destaques" | "recentes";
};
