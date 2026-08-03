import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kinder Garden AI",
  description: "A multimodal AI learning playground for text, image, and speech workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
