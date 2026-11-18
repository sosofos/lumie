# Lumiê

Site de padaria com foco em confeitaria, em **Next.js (App Router)** com **SQLite local**. Vitrine editorial com exploração pública, autenticação de clientes, área administrativa, catálogo gerenciável, bolos prontos e informação sobre entrega sob consulta (sem checkout de pedidos).

## Executar

```bash
npm install
npm run dev
npm run build
npm start
npm run typecheck
```

O banco é criado em `data/maison.db` na primeira execução. `MAISON_DB_PATH` permite escolher outro caminho. O banco antigo `data/poa.db` pode ser migrado automaticamente.

## Acesso de demonstração

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Administrador | `admin@maisonaurelie.com.br` | `AurelieAdmin2026` |
| Cliente | `cliente@maisonaurelie.com.br` | `AurelieCliente2026` |

Os e-mails existentes foram mantidos para preservar os acessos. As credenciais de demonstração aparecem apenas fora de produção; altere-as antes de um uso real.

## Identidade e atendimento

A marca é **Lumiê**. A interface conserva a paleta pastel, Fraunces + Jost e o poá em detalhes gráficos do site; as fotografias de produtos e do ateliê não recebem estampas de poá.

A vitrine informa duas modalidades: retirada no endereço exibido no site e **entrega sob consulta**. A área, a taxa e o prazo precisam ser confirmados com a equipe. Não há carrinho, checkout ou criação de pedidos.

## Estrutura

```text
app/                     rotas públicas, cliente e administração
components/              componentes compartilhados e formulários
lib/                     SQLite, esquema, migrações, autenticação e catálogo
public/img/              fotografias locais otimizadas
scripts/                 utilitários de desenvolvimento
```

## Segurança

- Senhas com `scrypt` e salt aleatório; sessões opacas com hash SHA-256 no banco.
- Cookie `httpOnly`; `SameSite=None; Secure` para Preview HTTPS e `Lax` apenas em localhost.
- Guardas no servidor para usuário e administrador, com validação Zod e limites de tentativas.
- As alterações de catálogo são restritas ao painel administrativo.

## Banco e publicação

SQLite local com WAL, chaves estrangeiras e tabelas de usuários, sessões, categorias, produtos, favoritos e configurações. O Dockerfile executa Next.js standalone sem privilégios e disponibiliza `/api/health`. Em produção, o banco precisa de armazenamento persistente.
