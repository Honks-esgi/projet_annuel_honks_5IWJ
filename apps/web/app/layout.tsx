import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Honks — Qui est dispo ce soir ?",
  description:
    "Honks permet de coordonner rapidement des sessions de jeu entre amis : envoie un Honk, tes amis répondent, la session démarre.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
