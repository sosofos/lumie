import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lumiê — padaria & confeitaria artesanal",
    template: "%s · Lumiê",
  },
  description:
    "Bolos, tortas, doces finos e bolos prontos. Conheça a vitrine da Lumiê e guarde seus favoritos. Entrega sob consulta ou retirada no ateliê.",
  applicationName: "Lumiê",
  keywords: [
    "confeitaria",
    "padaria",
    "bolos artesanais",
    "tortas",
    "doces finos",
    "Lumiê",
  ],
  openGraph: {
    title: "Lumiê — padaria & confeitaria artesanal",
    description:
      "Uma vitrine de confeitaria feita para ser descoberta devagar: doces finos, tortas, bolos prontos e pães de fermentação natural.",
    type: "website",
    locale: "pt_BR",
    siteName: "Lumiê",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf4ec",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
