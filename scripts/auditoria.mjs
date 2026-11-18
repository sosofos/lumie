// Auditoria visual: mede overflow horizontal e salva capturas em /home/ubuntu/shots.
// Uso: node scripts/auditoria.mjs
import { chromium } from "playwright";
import Database from "better-sqlite3";
import { createHash, randomBytes } from "node:crypto";
import fs from "node:fs/promises";

const BASE = process.env.BASE ?? "http://127.0.0.1:3000";
const db = new Database(process.env.MAISON_DB_PATH ?? "./data/maison.db");

const criadas = [];

function criarSessao(perfil) {
  const usuario = db.prepare("SELECT id FROM usuarios WHERE perfil = ? LIMIT 1").get(perfil);
  const token = randomBytes(32).toString("hex");
  const hash = createHash("sha256").update(token).digest("hex");
  db.prepare("INSERT INTO sessoes (token_hash, usuario_id, expira_em) VALUES (?, ?, ?)").run(
    hash,
    usuario.id,
    Date.now() + 3600_000,
  );
  criadas.push(hash);
  return token;
}

const rotas = [
  { caminho: "/", nome: "entrada", perfil: null },
  { caminho: "/explorar", nome: "explorar", perfil: null },
  { caminho: "/entrar", nome: "entrar", perfil: null },
  { caminho: "/cadastro", nome: "cadastro", perfil: null },
  { caminho: "/admin/entrar", nome: "admin-entrar", perfil: null },
  { caminho: "/acesso-negado", nome: "acesso-negado", perfil: null },
  { caminho: "/cliente", nome: "cliente", perfil: "cliente" },
  { caminho: "/cliente/catalogo", nome: "catalogo", perfil: "cliente" },
  { caminho: "/cliente/catalogo?categoria=bolos", nome: "catalogo-bolos", perfil: "cliente" },
  { caminho: "/cliente/bolos-prontos", nome: "bolos-prontos", perfil: "cliente" },
  { caminho: "/cliente/produtos/camafeu-aurelie", nome: "produto", perfil: "cliente" },
  { caminho: "/cliente/favoritos", nome: "favoritos", perfil: "cliente" },
  { caminho: "/cliente/perfil", nome: "perfil", perfil: "cliente" },
  { caminho: "/admin", nome: "admin", perfil: "admin" },
  { caminho: "/admin/produtos", nome: "admin-produtos", perfil: "admin" },
  { caminho: "/admin/produtos/novo", nome: "admin-novo", perfil: "admin" },
  { caminho: `/admin/produtos/${db.prepare("SELECT id FROM produtos ORDER BY id LIMIT 1").get().id}/editar`, nome: "admin-editar", perfil: "admin" },
  { caminho: "/admin/categorias", nome: "admin-categorias", perfil: "admin" },
  { caminho: "/admin/usuarios", nome: "admin-usuarios", perfil: "admin" },
];

const tokens = { cliente: criarSessao("cliente"), admin: criarSessao("admin") };
await fs.mkdir("/home/ubuntu/shots", { recursive: true });

const navegador = await chromium.launch({ executablePath: "/usr/bin/chromium" });
const problemas = [];

for (const largura of [1280, 390]) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: largura === 390 ? 844 : 900 },
  });

  for (const rota of rotas) {
    const pagina = await contexto.newPage();
    if (rota.perfil) {
      await contexto.addCookies([
        { name: "poa_sessao", value: tokens[rota.perfil], domain: "127.0.0.1", path: "/", httpOnly: true, secure: false },
      ]);
    }
    const resposta = await pagina.goto(BASE + rota.caminho, { waitUntil: "networkidle" });
    // força carregamento das imagens preguiçosas
    await pagina.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
      window.scrollTo(0, 0);
    });
    await pagina.waitForTimeout(500);

    const medidas = await pagina.evaluate(() => {
      const doc = document.documentElement;
      const largos = [...document.querySelectorAll("body *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1);
        })
        .slice(0, 4)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)}`);
      const quebradas = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src);
      return {
        status: doc.dataset.ok,
        overflow: doc.scrollWidth - window.innerWidth,
        largos,
        quebradas,
      };
    });

    const arquivo = `/home/ubuntu/shots/${rota.nome}-${largura}.png`;
    await pagina.screenshot({ path: arquivo, fullPage: largura === 390 });
    console.log(
      `${String(largura).padStart(4)} ${rota.caminho.padEnd(38)} HTTP ${resposta?.status()} overflow=${medidas.overflow} ${medidas.largos.join(",")}${medidas.quebradas.length ? " IMG_QUEBRADA=" + medidas.quebradas.join(" ") : ""}`,
    );
    if (medidas.overflow > 0 || medidas.quebradas.length) problemas.push({ rota, ...medidas });
    await pagina.close();
  }
  await contexto.close();
}

await navegador.close();
for (const hash of criadas) db.prepare("DELETE FROM sessoes WHERE token_hash = ?").run(hash);
console.log(`\nProblemas: ${problemas.length}`);
