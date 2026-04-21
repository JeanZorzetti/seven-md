import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sevenmd.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Seven-MD — Equipamentos Hospitalares & Telemedicina',
    template: '%s | Seven-MD',
  },
  description: 'Aluguel de equipamentos hospitalares para cuidados domiciliares e telemedicina com especialistas. Entrega em domicílio, suporte 24h.',
  keywords: ['equipamentos hospitalares', 'locação de equipamentos', 'telemedicina', 'concentrador de oxigênio', 'cama hospitalar', 'cadeira de rodas'],
  openGraph: {
    siteName: 'Seven-MD',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
