import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "backyardultra.app",
  description: "An application for backyard ultras",
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme='cupcake'>
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;