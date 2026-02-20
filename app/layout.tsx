import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trade Forge — Track, Analyze, Win",
  description:
    "The ultimate trading journal for crypto, forex, binary, and more. AI-powered pattern detection, strict risk rules, beautiful analytics. Your edge in one place.",
  keywords: [
    "trading journal",
    "crypto trading",
    "forex journal",
    "trade tracker",
    "PNL tracker",
    "trading analytics",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
