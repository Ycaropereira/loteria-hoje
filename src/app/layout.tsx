import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://loteria-hoje-ten.vercel.app"),
  title: "Resultado da Loteria Hoje - Mega-Sena, Quina e Lotofácil",
  description:
    "Confira o resultado da loteria hoje: Mega-Sena, Quina e Lotofácil. Veja dezenas sorteadas, data do concurso e se acumulou.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Resultado da Loteria Hoje",
    description:
      "Resultado atualizado de Mega-Sena, Quina e Lotofácil com dezenas sorteadas e informações do concurso.",
    type: "website",
    locale: "pt_BR",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Resultado da Loteria Hoje",
    description:
      "Resultado atualizado de Mega-Sena, Quina e Lotofácil com dezenas sorteadas e informações do concurso.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="mt-auto border-t border-black/5 bg-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-600">© {new Date().getFullYear()} Loteria Hoje</p>
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <Link className="text-zinc-700 hover:underline" href="/privacidade">
                Privacidade
              </Link>
              <Link className="text-zinc-700 hover:underline" href="/termos">
                Termos
              </Link>
              <Link className="text-zinc-700 hover:underline" href="/contato">
                Contato
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
