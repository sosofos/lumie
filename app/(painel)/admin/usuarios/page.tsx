import type { Metadata } from "next";
import { exigirAdmin } from "@/lib/auth";
import { formatarData } from "@/lib/format";
import { listarUsuarios } from "@/lib/users";

export const metadata: Metadata = {
  title: "Usuários",
  robots: { index: false, follow: false },
};

export default async function PaginaAdminUsuarios() {
  await exigirAdmin();

  const usuarios = listarUsuarios();
  const clientes = usuarios.filter((usuario) => usuario.perfil === "cliente").length;
  const admins = usuarios.length - clientes;

  return (
    <div>
      <p className="poa-rotulo text-framboesa-escura">Acessos</p>
      <h1 className="mt-3 font-display text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[0.95]">
        Quem entra <span className="italic text-framboesa">na casa</span>.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-cacau/60">
        {clientes} {clientes === 1 ? "cliente" : "clientes"} com acesso à vitrine e {admins}{" "}
        {admins === 1 ? "administrador" : "administradores"} com acesso a este painel.
      </p>

      <section className="poa-card mt-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="poa-tabela min-w-[640px]">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Cadastro</th>
                <th>Último acesso</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-rosa font-display text-sm text-framboesa-escura">
                        {usuario.nome.trim().charAt(0).toUpperCase()}
                      </span>
                      <span className="font-medium">{usuario.nome}</span>
                    </div>
                  </td>
                  <td className="text-cacau/65">{usuario.email}</td>
                  <td>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.14em] ${
                        usuario.perfil === "admin"
                          ? "bg-cacau text-creme"
                          : "bg-pistache text-oliva"
                      }`}
                    >
                      {usuario.perfil === "admin" ? "Administrador" : "Cliente"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-cacau/50">{formatarData(usuario.criado_em)}</td>
                  <td className="whitespace-nowrap text-cacau/50">
                    {formatarData(usuario.ultimo_acesso_em)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
