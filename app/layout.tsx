import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./@header/Header";
import { HeroesProvider } from "./Context/HeroesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "league of legends",
  description: "Ataualiza a equipa de super-heróis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <HeroesProvider>
          <Header projectName="league of legends" myName="Maria Pinto" />
          <main>{children}</main>
        </HeroesProvider>
      </body>
    </html>
  );
}