import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const openingHoursSans = localFont({
  src: [
    { path: "../../public/fonts/OpeningHoursSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/OpeningHoursSans-Regular.woff", weight: "400", style: "normal" },
  ],
  variable: "--font-opening-hours",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Myriam Perez | Inspire & Impact — Formateur certifié au Québec",
  description:
    "Devenez formateur certifié au Québec et transformez votre expertise en formation professionnelle reconnue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${openingHoursSans.variable} overflow-x-hidden font-sans antialiased bg-cream-50 text-espresso-900`}>
        {children}
      </body>
    </html>
  );
}
