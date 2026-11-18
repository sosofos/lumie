import type Database from "better-sqlite3";
import { hashSenhaSync } from "./password";

export const IMAGENS = {
  hero: "/img/hero-vitrine.webp",
  atelier: "/img/atelier.webp",
  camafeu: "/img/produtos/camafeu-lumie.webp",
  nuvem: "/img/produtos/nuvem-de-baunilha.webp",
  lavanda: "/img/produtos/lavanda-e-mel.webp",
  cenoura: "/img/produtos/bolo-de-cenoura.webp",
  redVelvet: "/img/produtos/red-velvet.webp",
  damasco: "/img/produtos/bolo-de-damasco.webp",
  framboesa: "/img/produtos/torta-framboesa-pistache.webp",
  limao: "/img/produtos/torta-limao-siciliano.webp",
  chocolateSal: "/img/produtos/torta-chocolate-flor-de-sal.webp",
  eclair: "/img/produtos/eclair-pistache.webp",
  macarons: "/img/produtos/macarons-lumie.webp",
  brigadeiro: "/img/produtos/brigadeiro-gourmet.webp",
  tartelete: "/img/produtos/tartelete-de-frutas-vermelhas.webp",
  madeleine: "/img/produtos/madeleines-de-limao.webp",
  trufa: "/img/produtos/trufas-de-champagne.webp",
  quindim: "/img/produtos/quindim.webp",
  cookie: "/img/produtos/cookies-chocolate-belga.webp",
  bemCasado: "/img/produtos/bem-casados.webp",
  croissant: "/img/produtos/croissant-laminado.webp",
  pao: "/img/produtos/pao-fermentacao-natural.webp",
  panna: "/img/produtos/panna-cotta.webp",
} as const;

/** Credenciais criadas apenas na primeira inicialização do banco. */
export const CONTAS_DEMONSTRACAO = {
  admin: { email: "admin@maisonaurelie.com.br", senha: "AurelieAdmin2026" },
  cliente: { email: "cliente@maisonaurelie.com.br", senha: "AurelieCliente2026" },
} as const;

/** Versão do conteúdo inicial; atualizações futuras devem ser incrementais e não destrutivas. */
const VERSAO_SEED = 2;

const CATEGORIAS = [
  {
    nome: "Bolos",
    slug: "bolos",
    descricao: "Camadas generosas, recheios frescos e acabamento de ateliê.",
    ordem: 1,
  },
  {
    nome: "Tortas",
    slug: "tortas",
    descricao: "Massas crocantes com cremes leves e frutas da estação.",
    ordem: 2,
  },
  {
    nome: "Doces Finos",
    slug: "doces-finos",
    descricao: "Pequenas peças feitas à mão, uma a uma, para serem lembradas.",
    ordem: 3,
  },
  {
    nome: "Pães Artesanais",
    slug: "paes-artesanais",
    descricao: "Fermentação longa, farinha selecionada e crosta dourada.",
    ordem: 4,
  },
  {
    nome: "Sobremesas",
    slug: "sobremesas",
    descricao: "O ponto final delicado de qualquer tarde.",
    ordem: 5,
  },
];

type ProdutoSeed = {
  nome: string;
  slug: string;
  categoria: string;
  resumo: string;
  descricao: string;
  preco_centavos: number;
  imagem_url: string;
  selo: string | null;
  destaque: number;
  pronto_retirada: number;
};

const PRODUTOS: ProdutoSeed[] = [
  /* ------------------------------- Bolos ------------------------------- */
  {
    nome: "Camafeu Lumiê",
    slug: "camafeu-lumie",
    categoria: "bolos",
    resumo: "Bolo de chocolate 60% com ganache sedoso e confeitos de cacau.",
    descricao:
      "Nosso bolo-assinatura: três camadas de chocolate amargo 60% umedecidas com calda de cacau, recheio de ganache meio amargo e acabamento em chocolate belga com pontos de ouro. É denso do jeito certo, feito para dividir devagar.",
    preco_centavos: 18900,
    imagem_url: IMAGENS.camafeu,
    selo: "Assinatura",
    destaque: 1,
    pronto_retirada: 1,
  },
  {
    nome: "Nuvem de Baunilha",
    slug: "nuvem-de-baunilha",
    categoria: "bolos",
    resumo: "Bolo naked de baunilha com chantilly e frutas vermelhas frescas.",
    descricao:
      "Massa leve de baunilha de Madagascar, chantilly batido na hora e uma coroa de morangos, mirtilos e flores comestíveis. Delicado, perfumado e feito para mesas de aniversário sem exagero.",
    preco_centavos: 16500,
    imagem_url: IMAGENS.nuvem,
    selo: "Favorito",
    destaque: 1,
    pronto_retirada: 1,
  },
  {
    nome: "Lavanda & Mel",
    slug: "lavanda-e-mel",
    categoria: "bolos",
    resumo: "Camadas de baunilha, buttercream de lavanda e fio de mel de laranjeira.",
    descricao:
      "Um bolo lilás de sabor suave: buttercream infusionado com lavanda orgânica, mel de laranjeira e um toque de limão para equilibrar. A calma em forma de fatia.",
    preco_centavos: 17200,
    imagem_url: IMAGENS.lavanda,
    selo: null,
    destaque: 0,
    pronto_retirada: 1,
  },
  {
    nome: "Bolo de Cenoura & Cream Cheese",
    slug: "bolo-de-cenoura-e-cream-cheese",
    categoria: "bolos",
    resumo: "Cenoura fresca, especiarias e cobertura cremosa de cream cheese.",
    descricao:
      "Cenouras raladas na hora, canela, noz-moscada e azeite no lugar de parte da manteiga. A cobertura é de cream cheese batido com baunilha — aquele bolo de tarde que nunca sai de moda.",
    preco_centavos: 9800,
    imagem_url: IMAGENS.cenoura,
    selo: null,
    destaque: 1,
    pronto_retirada: 1,
  },
  {
    nome: "Red Velvet",
    slug: "red-velvet",
    categoria: "bolos",
    resumo: "Massa vermelha aveludada com frosting de cream cheese e cacau.",
    descricao:
      "Massa úmida de cacau com cor vermelha natural de beterraba, recheio generoso de cream cheese e acabamento em rosetas. Servido em fatias altas, como manda a tradição.",
    preco_centavos: 17800,
    imagem_url: IMAGENS.redVelvet,
    selo: null,
    destaque: 0,
    pronto_retirada: 1,
  },
  {
    nome: "Bolo de Damasco & Amêndoas",
    slug: "bolo-de-damasco-e-amendoas",
    categoria: "bolos",
    resumo: "Amêndoas moídas, damascos caramelizados e açúcar de confeiteiro.",
    descricao:
      "Bolo rústico de farinha de amêndoas com damascos caramelizados em mel e flocos de amêndoa tostados. Ótimo com café, chá preto ou uma taça de vinho branco.",
    preco_centavos: 15600,
    imagem_url: IMAGENS.damasco,
    selo: null,
    destaque: 0,
    pronto_retirada: 1,
  },

  /* ------------------------------- Tortas ------------------------------ */
  {
    nome: "Torta de Framboesa & Pistache",
    slug: "torta-framboesa-e-pistache",
    categoria: "tortas",
    resumo: "Creme de pistache siciliano, framboesas frescas e massa sablée.",
    descricao:
      "Base crocante de sablée amanteigada, creme de pistache siciliano moído no ateliê e framboesas frescas com geleia rústica. Doce e ácido no mesmo garfo.",
    preco_centavos: 14800,
    imagem_url: IMAGENS.framboesa,
    selo: "Sazonal",
    destaque: 1,
    pronto_retirada: 0,
  },
  {
    nome: "Torta de Limão Siciliano",
    slug: "torta-de-limao-siciliano",
    categoria: "tortas",
    resumo: "Curd de limão siciliano com merengue maçaricado na hora.",
    descricao:
      "Massa de biscoito amanteigado, curd azedinho de limão siciliano e merengue suíço tostado com maçarico. A fatia que acorda qualquer tarde preguiçosa.",
    preco_centavos: 13200,
    imagem_url: IMAGENS.limao,
    selo: null,
    destaque: 0,
    pronto_retirada: 0,
  },
  {
    nome: "Torta de Chocolate & Flor de Sal",
    slug: "torta-de-chocolate-e-flor-de-sal",
    categoria: "tortas",
    resumo: "Ganache de chocolate 70% com flor de sal e nibs crocantes.",
    descricao:
      "Ganache intenso de chocolate 70% sobre massa de cacau, finalizado com flor de sal e nibs. Poucos ingredientes, nenhum atalho — e uma fatia que rende silêncio à mesa.",
    preco_centavos: 13900,
    imagem_url: IMAGENS.chocolateSal,
    selo: null,
    destaque: 1,
    pronto_retirada: 0,
  },

  /* ---------------------------- Doces finos ---------------------------- */
  {
    nome: "Éclair de Pistache",
    slug: "eclair-de-pistache",
    categoria: "doces-finos",
    resumo: "Choux crocante, creme de pistache e glaçage verde-pálido.",
    descricao:
      "Massa choux assada até ficar oca e crocante, recheada com creme de pistache e coberta por glaçage espelhado. Feita em pequenas fornadas, todos os dias.",
    preco_centavos: 2400,
    imagem_url: IMAGENS.eclair,
    selo: null,
    destaque: 1,
    pronto_retirada: 0,
  },
  {
    nome: "Macarons Lumiê (caixa com 6)",
    slug: "macarons-lumie",
    categoria: "doces-finos",
    resumo: "Seis macarons em rosa, baunilha, pistache, lavanda e limão.",
    descricao:
      "Casquinha fina, interior úmido e recheios leves. A caixa vem em tons pastel — rosa, amarelo e lilás — perfeita para levar de presente (ou não).",
    preco_centavos: 5800,
    imagem_url: IMAGENS.macarons,
    selo: null,
    destaque: 0,
    pronto_retirada: 0,
  },
  {
    nome: "Brigadeiros Gourmet (caixa com 9)",
    slug: "brigadeiros-gourmet",
    categoria: "doces-finos",
    resumo: "Nove brigadeiros enrolados à mão, com quatro acabamentos.",
    descricao:
      "Chocolate belga, manteiga de verdade e nenhuma pressa. Acabamentos em pistache, nibs de cacau, confeitos rosa e folha de ouro. O clássico brasileiro com roupa de festa.",
    preco_centavos: 4900,
    imagem_url: IMAGENS.brigadeiro,
    selo: null,
    destaque: 0,
    pronto_retirada: 0,
  },
  {
    nome: "Tarteletes de Frutas Vermelhas (caixa com 4)",
    slug: "tarteletes-de-frutas-vermelhas",
    categoria: "doces-finos",
    resumo: "Quatro tarteletes de creme de baunilha com frutas frescas.",
    descricao:
      "Massa sablée fininha, creme de confeiteiro com baunilha e uma cama de framboesas, mirtilos e groselhas. Montadas na hora da retirada para a massa não perder o crocante.",
    preco_centavos: 4200,
    imagem_url: IMAGENS.tartelete,
    selo: "Novo",
    destaque: 1,
    pronto_retirada: 0,
  },
  {
    nome: "Madeleines de Limão (caixa com 6)",
    slug: "madeleines-de-limao",
    categoria: "doces-finos",
    resumo: "Seis madeleines de limão com glacê e raspas frescas.",
    descricao:
      "Bordas crocantes, miolo de bolo e um perfume cítrico que enche o ateliê. Duas vêm com glacê de limão siciliano; as outras, polvilhadas com açúcar de confeiteiro.",
    preco_centavos: 3800,
    imagem_url: IMAGENS.madeleine,
    selo: null,
    destaque: 0,
    pronto_retirada: 0,
  },
  {
    nome: "Trufas de Champagne (caixa com 9)",
    slug: "trufas-de-champagne",
    categoria: "doces-finos",
    resumo: "Ganache de chocolate meio amargo com champagne e cacau.",
    descricao:
      "Ganache leve de chocolate meio amargo aromatizada com champagne brut, enrolada à mão e coberta de cacau fino. Uma trufa com folha de ouro em cada caixa.",
    preco_centavos: 6400,
    imagem_url: IMAGENS.trufa,
    selo: "Presente",
    destaque: 1,
    pronto_retirada: 0,
  },
  {
    nome: "Quindim Brûlé",
    slug: "quindim-brule",
    categoria: "doces-finos",
    resumo: "Quindim cremoso de coco com casquinha de açúcar queimado.",
    descricao:
      "Gema, coco fresco e açúcar na medida exata, assado lentamente até ficar brilhante. A casquinha de açúcar queimado no maçarico é a nossa assinatura brasileira.",
    preco_centavos: 1800,
    imagem_url: IMAGENS.quindim,
    selo: null,
    destaque: 0,
    pronto_retirada: 0,
  },
  {
    nome: "Cookies de Chocolate Belga (caixa com 3)",
    slug: "cookies-de-chocolate-belga",
    categoria: "doces-finos",
    resumo: "Três cookies grossos com chocolate belga em pedaços grandes.",
    descricao:
      "Bordas crocantes, centro macio e pedaços de chocolate belga que derretem na boca. Assados duas vezes ao dia para chegar quentinhos à vitrine.",
    preco_centavos: 2600,
    imagem_url: IMAGENS.cookie,
    selo: null,
    destaque: 0,
    pronto_retirada: 0,
  },
  {
    nome: "Bem-casados (caixa com 6)",
    slug: "bem-casados",
    categoria: "doces-finos",
    resumo: "Seis bem-casados de pão de ló e doce de leite caseiro.",
    descricao:
      "Pão de ló fofinho, doce de leite cozido na panela por três horas e açúcar de confeiteiro por cima. O doce de festa que a gente gosta de servir fora das festas.",
    preco_centavos: 4400,
    imagem_url: IMAGENS.bemCasado,
    selo: null,
    destaque: 0,
    pronto_retirada: 0,
  },

  /* -------------------------- Pães artesanais -------------------------- */
  {
    nome: "Croissant Laminado",
    slug: "croissant-laminado",
    categoria: "paes-artesanais",
    resumo: "27 camadas de manteiga francesa, assado em duas etapas.",
    descricao:
      "Três dias de processo: fermentação lenta, laminação à mão com manteiga francesa e assadura em dois tempos. Crosta que estala e miolo em favo de mel.",
    preco_centavos: 1600,
    imagem_url: IMAGENS.croissant,
    selo: null,
    destaque: 0,
    pronto_retirada: 0,
  },
  {
    nome: "Pão de Fermentação Natural",
    slug: "pao-de-fermentacao-natural",
    categoria: "paes-artesanais",
    resumo: "Levain de 24 horas, farinha integral e crosta caramelizada.",
    descricao:
      "Nosso fermento natural tem nome e rotina. O pão descansa 24 horas, ganha crosta profunda e miolo úmido com alvéolos grandes. Vendido inteiro ou em meia unidade.",
    preco_centavos: 3200,
    imagem_url: IMAGENS.pao,
    selo: "Artesanal",
    destaque: 1,
    pronto_retirada: 0,
  },

  /* ----------------------------- Sobremesas ---------------------------- */
  {
    nome: "Panna Cotta de Frutas Vermelhas",
    slug: "panna-cotta-de-frutas-vermelhas",
    categoria: "sobremesas",
    resumo: "Creme de baunilha com compota de morango e framboesa.",
    descricao:
      "Panna cotta de textura trêmula, baunilha de verdade e compota de frutas vermelhas feita na panela. Servida em taça, com folha de hortelã do jardim.",
    preco_centavos: 2800,
    imagem_url: IMAGENS.panna,
    selo: "Novo",
    destaque: 0,
    pronto_retirada: 0,
  },
];

const CONTAS_LEGADAS = [
  {
    antigo: "admin@poaconfeitaria.com.br",
    novo: CONTAS_DEMONSTRACAO.admin.email,
    nome: "Equipe Lumiê",
    senha: CONTAS_DEMONSTRACAO.admin.senha,
  },
  {
    antigo: "cliente@poaconfeitaria.com.br",
    novo: CONTAS_DEMONSTRACAO.cliente.email,
    nome: "Marina Duarte",
    senha: CONTAS_DEMONSTRACAO.cliente.senha,
  },
];

function versaoAtual(db: Database.Database): number {
  const marcador = db
    .prepare("SELECT valor FROM configuracoes WHERE chave = 'seed_versao'")
    .get() as { valor: string } | undefined;
  return marcador ? Number(marcador.valor) || 0 : 0;
}

/**
 * Popula o banco apenas quando o conteúdo está desatualizado. Tudo roda numa
 * única transação: se algo falhar, nada fica pela metade.
 */
export function seedIfNeeded(db: Database.Database): void {
  const executar = db.transaction(() => {
    // Atualizações de marca preservam os IDs, as relações e os favoritos existentes.
    db.prepare("UPDATE usuarios SET nome = 'Equipe Lumiê' WHERE nome = 'Equipe Aurélie'").run();
    db.prepare(
      `UPDATE produtos
       SET nome = 'Camafeu Lumiê', slug = 'camafeu-lumie', imagem_url = '/img/produtos/camafeu-lumie.webp'
       WHERE slug = 'camafeu-aurelie'`,
    ).run();
    db.prepare(
      `UPDATE produtos
       SET nome = 'Macarons Lumiê (caixa com 6)', slug = 'macarons-lumie', imagem_url = '/img/produtos/macarons-lumie.webp'
       WHERE slug = 'macarons-aurelie'`,
    ).run();

    if (versaoAtual(db) >= VERSAO_SEED) return;

    const inserirUsuario = db.prepare(
      `INSERT OR IGNORE INTO usuarios (nome, email, senha_hash, perfil)
       VALUES (@nome, @email, @senha_hash, @perfil)`,
    );

    // Contas antigas da versão anterior ganham o novo endereço da casa.
    const atualizarLegado = db.prepare(
      "UPDATE usuarios SET email = @novo, nome = @nome, senha_hash = @senha_hash WHERE email = @antigo",
    );
    for (const conta of CONTAS_LEGADAS) {
      atualizarLegado.run({
        antigo: conta.antigo,
        novo: conta.novo,
        nome: conta.nome,
        senha_hash: hashSenhaSync(conta.senha),
      });
    }

    inserirUsuario.run({
      nome: "Equipe Lumiê",
      email: CONTAS_DEMONSTRACAO.admin.email,
      senha_hash: hashSenhaSync(CONTAS_DEMONSTRACAO.admin.senha),
      perfil: "admin",
    });
    inserirUsuario.run({
      nome: "Marina Duarte",
      email: CONTAS_DEMONSTRACAO.cliente.email,
      senha_hash: hashSenhaSync(CONTAS_DEMONSTRACAO.cliente.senha),
      perfil: "cliente",
    });

    // Catálogo: adicione apenas categorias e produtos ausentes; nunca apague
    // dados ou sobrescreva conteúdo que a equipe já cadastrou no painel.
    const inserirCategoria = db.prepare(
      `INSERT OR IGNORE INTO categorias (nome, slug, descricao, ordem)
       VALUES (@nome, @slug, @descricao, @ordem)`,
    );
    for (const categoria of CATEGORIAS) inserirCategoria.run(categoria);

    const buscarCategoria = db.prepare("SELECT id FROM categorias WHERE slug = ?");
    const inserirProduto = db.prepare(
      `INSERT OR IGNORE INTO produtos
         (nome, slug, categoria_id, resumo, descricao, preco_centavos, imagem_url, selo, destaque, ativo, pronto_retirada)
       VALUES
         (@nome, @slug, @categoria_id, @resumo, @descricao, @preco_centavos, @imagem_url, @selo, @destaque, 1, @pronto_retirada)`,
    );
    for (const produto of PRODUTOS) {
      const categoria = buscarCategoria.get(produto.categoria) as { id: number } | undefined;
      if (!categoria) continue;
      inserirProduto.run({
        nome: produto.nome,
        slug: produto.slug,
        categoria_id: categoria.id,
        resumo: produto.resumo,
        descricao: produto.descricao,
        preco_centavos: produto.preco_centavos,
        imagem_url: produto.imagem_url,
        selo: produto.selo,
        destaque: produto.destaque,
        pronto_retirada: produto.pronto_retirada,
      });
    }

    db.prepare(
      `INSERT INTO configuracoes (chave, valor) VALUES ('seed_versao', @versao)
       ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor`,
    ).run({ versao: String(VERSAO_SEED) });
  });

  executar();
}
