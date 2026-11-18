// Baixa as imagens geradas do armazenamento do projeto para public/img,
// redimensiona e converte em WebP otimizado.
// Uso: node scripts/baixar-imagens.mjs
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const BASE = process.env.MANUS_API_URL;
const KEY = process.env.MANUS_API_KEY;

const MAPA = {
  "hero-vitrine": ["Qd1wa4P8ulCZtHIliGsKBI/image-1.webp", 1600],
  "produtos/camafeu-lumie": ["Qd1wa4P8ulCZtHIliGsKBI/image-2.webp", 1000],
  "produtos/nuvem-de-baunilha": ["Qd1wa4P8ulCZtHIliGsKBI/image-3.webp", 1000],
  "produtos/lavanda-e-mel": ["Qd1wa4P8ulCZtHIliGsKBI/image-4.webp", 1000],
  "produtos/torta-framboesa-pistache": ["Qd1wa4P8ulCZtHIliGsKBI/image-5.webp", 1000],
  "produtos/torta-limao-siciliano": ["o1jQqmUY1XjmH5SFmGRAcK/image-1.webp", 1000],
  "produtos/torta-chocolate-flor-de-sal": ["o1jQqmUY1XjmH5SFmGRAcK/image-2.webp", 1000],
  "produtos/eclair-pistache": ["o1jQqmUY1XjmH5SFmGRAcK/image-3.webp", 1000],
  "produtos/macarons-lumie": ["o1jQqmUY1XjmH5SFmGRAcK/image-4.webp", 1000],
  "produtos/brigadeiro-gourmet": ["o1jQqmUY1XjmH5SFmGRAcK/image-5.webp", 1000],
  "produtos/croissant-laminado": ["mGatv1Bc4wTcrFLKnNsJCb/image-1.webp", 1000],
  "produtos/pao-fermentacao-natural": ["mGatv1Bc4wTcrFLKnNsJCb/image-2.webp", 1000],
  "produtos/panna-cotta": ["mGatv1Bc4wTcrFLKnNsJCb/image-3.webp", 1000],
  "produtos/tartelete-de-frutas-vermelhas": ["kurb4ron9NO35ut9upx2x5/image-1.webp", 1000],
  "produtos/madeleines-de-limao": ["kurb4ron9NO35ut9upx2x5/image-2.webp", 1000],
  "produtos/trufas-de-champagne": ["kurb4ron9NO35ut9upx2x5/image-3.webp", 1000],
  "produtos/quindim": ["GqpJAx2kvHzr7C55uFqLqP/image-1.webp", 1000],
  "produtos/cookies-chocolate-belga": ["GqpJAx2kvHzr7C55uFqLqP/image-2.webp", 1000],
  "produtos/bem-casados": ["GqpJAx2kvHzr7C55uFqLqP/image-3.webp", 1000],
  "produtos/bolo-de-cenoura": ["yYaJSSmhFFLmZVsQmwh9h2/image-1.webp", 1000],
  "produtos/red-velvet": ["yYaJSSmhFFLmZVsQmwh9h2/image-2.webp", 1000],
  "produtos/bolo-de-damasco": ["yYaJSSmhFFLmZVsQmwh9h2/image-3.webp", 1000],
  atelier: ["Oq4lsqyeGeX0gOkbimLh4I/image-1.webp", 1400],
};

const destino = path.join(process.cwd(), "public", "img");
await fs.mkdir(path.join(destino, "produtos"), { recursive: true });

const resultados = [];

for (const [nome, [chave, largura]] of Object.entries(MAPA)) {
  const resposta = await fetch(
    `${BASE}/v1/storage/presign/get?path=${encodeURIComponent(`async-images/${chave}`)}`,
    { headers: { Authorization: `Bearer ${KEY}` } },
  );
  const { url } = await resposta.json();
  if (!url) {
    resultados.push([nome, "sem url"]);
    continue;
  }

  const arquivo = await fetch(url);
  const bytes = Buffer.from(await arquivo.arrayBuffer());
  if (bytes.length < 20_000) {
    resultados.push([nome, `pequeno demais (${bytes.length})`]);
    continue;
  }

  const saida = path.join(destino, `${nome}.webp`);
  await fs.mkdir(path.dirname(saida), { recursive: true });
  const info = await sharp(bytes)
    .rotate()
    .resize({ width: largura, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(saida);

  resultados.push([nome, `${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`]);
}

for (const [nome, info] of resultados) console.log(`${nome.padEnd(36)} ${info}`);
