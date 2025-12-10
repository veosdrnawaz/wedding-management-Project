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
      <head>
         <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}