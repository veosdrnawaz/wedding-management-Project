import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wedding Manager SaaS",
  description: "A comprehensive wedding management platform for Pakistan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}