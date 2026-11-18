/**
 * As contas de demonstração são úteis durante o desenvolvimento e no Preview,
 * mas nunca devem ser anunciadas em produção.
 */
export const MOSTRAR_CONTAS_DEMO = process.env.NODE_ENV !== "production";
