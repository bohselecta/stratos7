import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stratos 7 — Project Surface Prototype",
  description: "A fictional-data product prototype for persistent project control in ChatGPT/Codex.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
