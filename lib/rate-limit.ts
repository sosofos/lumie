/**
 * Limitador simples em memória para tentativas de login e cadastro. Protege
 * contra força bruta básica sem exigir serviço externo. Em múltiplas instâncias
 * cada uma tem sua própria janela — aceitável para o escopo deste projeto.
 */
type Registro = { tentativas: number; expira: number };

const MAX_TENTATIVAS = 6;
const JANELA_MS = 10 * 60 * 1000;
const MAX_CHAVES = 5_000;

const globalForLimitador = globalThis as unknown as {
  __maisonTentativas?: Map<string, Registro>;
};

function registros(): Map<string, Registro> {
  if (!globalForLimitador.__maisonTentativas) {
    globalForLimitador.__maisonTentativas = new Map();
  }
  return globalForLimitador.__maisonTentativas;
}

/** Remove janelas vencidas e evita crescimento ilimitado do mapa. */
function podar(mapa: Map<string, Registro>, agora: number): void {
  for (const [chave, registro] of mapa) {
    if (registro.expira < agora) mapa.delete(chave);
  }
  while (mapa.size > MAX_CHAVES) {
    const primeira = mapa.keys().next().value;
    if (primeira === undefined) break;
    mapa.delete(primeira);
  }
}

export function bloqueado(chave: string): boolean {
  const mapa = registros();
  const registro = mapa.get(chave);
  if (!registro) return false;
  if (registro.expira < Date.now()) {
    mapa.delete(chave);
    return false;
  }
  return registro.tentativas >= MAX_TENTATIVAS;
}

export function registrarFalha(chave: string): void {
  const mapa = registros();
  const agora = Date.now();
  podar(mapa, agora);

  const registro = mapa.get(chave);
  if (!registro || registro.expira < agora) {
    mapa.set(chave, { tentativas: 1, expira: agora + JANELA_MS });
    return;
  }
  registro.tentativas += 1;
}

export function limparTentativas(chave: string): void {
  registros().delete(chave);
}

export function minutosRestantes(chave: string): number {
  const registro = registros().get(chave);
  if (!registro) return 0;
  return Math.max(1, Math.ceil((registro.expira - Date.now()) / 60000));
}
