import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Healthcheck usado pela publicação do container (sem autenticação). */
export async function GET() {
  try {
    const db = getDb();
    const resultado = db.prepare("SELECT 1 AS ok").get() as { ok: number } | undefined;
    if (resultado?.ok !== 1) throw new Error("Consulta de verificação falhou");

    return NextResponse.json({ status: "ok", banco: "ok" });
  } catch (erro) {
    console.error("[health] falha na verificação", erro);
    return NextResponse.json({ status: "erro", banco: "indisponível" }, { status: 503 });
  }
}
