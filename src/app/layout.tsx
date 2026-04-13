import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Жизнь Виктории",
  description: "Небольшое признание в любви для Вики от Дани.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

