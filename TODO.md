# TODO — Lumiê

## 1. Identidade visual consistente em todas as páginas
- Estética predominantemente minimalista com elementos pontuais de maximalismo, elegante, delicada e marcante.
- Paleta suave (pastéis, neutros e cores de confeitaria) aplicada de forma consistente, incluindo amarelo pastel e roxo pastel.
- Padrão poá presente apenas na estética do site (fundos, detalhes decorativos e componentes), sem estampa de bolinhas nas fotos.
- Tipografia elegante com personalidade (display serif + sans humanista).
- Composições visuais criativas com alguns elementos maximalistas, sem aparência excessivamente simples.
- Imagens de qualidade dos produtos (doces, sobremesas, tortas, bolos, pães) em destaque.
- Sensação de confeitaria charmosa, acolhedora e contemporânea.

## 2. Nome e marca
- Marca renomeada para Lumiê com wordmark tipográfico simples, sem o emblema anterior; e-mails de acesso existentes permanecem para não quebrar as contas.
- Nenhuma referência visível ao nome anterior na interface.

## 3. Tela de entrada (não apenas formulário de login)
- Login funcional de clientes.
- Cadastro de novos clientes.
- Acesso específico para usuários administrativos, separado do acesso do cliente.
- Botão/seção "Explorar" com apresentação do conceito da confeitaria.
- Prévia visual dos produtos e da identidade da marca antes do login.

## 4. Exploração pública
- Página pública com conceito, identidade visual e prévia do catálogo, acessível sem autenticação.

## 5. Autenticação e sessões
- Autenticação funcional com senha protegida por hash (scrypt + salt) e sessões em banco.
- Sessão em cookie httpOnly, SameSite=None; Secure para Preview HTTPS, expiração validada no servidor.
- Login administrativo rejeita contas de cliente e vice-versa.
- Credenciais de demonstração visíveis apenas fora de produção.

## 6. Área do cliente
- Área protegida após login, com foco em descoberta e visualização dos produtos.
- Catálogo por categorias, busca sem diferenciar acentos e detalhe do produto.
- Grande variedade de doces finos na vitrine (nove itens) e destaque próprio na home do cliente.

## 7. Bolos prontos
- Opção de bolos prontos: peças inteiras já assadas, disponíveis para retirada no mesmo dia.
- Aba "Bolos prontos" na área do cliente listando somente os produtos marcados como prontos.
- Selo "Pronto hoje" nos cartões e na página do produto.
- Administração pode marcar/desmarcar um produto como pronto para retirada.
- A interface informa entrega sob consulta e retirada no ateliê, sem sugerir checkout/pedido online nem inventar área atendida, taxa ou prazo.

## 8. Área administrativa
- Área protegida exclusiva para administradores (guarda em layout, páginas e ações).
- Cadastro, edição e exclusão reais de produtos (persistidos no banco).
- Gestão de categorias (criar, editar, excluir com proteção quando houver produtos).
- Visão de usuários cadastrados e indicador de bolos prontos no dashboard.

## 9. Permissões e segurança
- Clientes e visitantes não acessam funcionalidades administrativas (rotas e ações bloqueadas no servidor).
- Validação de entradas com schema, proteção contra CSRF via Server Actions, rate limit de login.
- Destino de favoritos restrito a caminhos internos; favoritos de produtos inativos não aparecem.

## 10. Banco de dados SQL local
- SQLite local (arquivo em disco), sem serviços externos.
- Tabelas para usuários, perfis, sessões, categorias, produtos e favoritos; migração e seed idempotentes.

## 11. Responsividade
- Interface adaptada para desktop, tablet e celular, consistente em todas as páginas.

## 12. Entrega técnica
- Next.js com estrutura modular, tipos verificados, build de produção e Dockerfile com healthcheck.
- Rotas declaradas em `public/manus-routes.json` e `logoUrl` em `app.config.ts`.
- Validação final contra os requisitos (agente de verificação).
