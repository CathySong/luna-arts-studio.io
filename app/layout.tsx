import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, DM_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luna Art studio — Fine Art & Creative Classes",
  description:
    "Luna Art studio offers fine art exhibitions, painting and drawing classes, and a vibrant creative community. Explore our gallery and join our weekly classes.",
  keywords:
    "art studio, painting classes, drawing, fine art, art gallery, creative classes, New Jersey",
  openGraph: {
    title: "Luna Art studio",
    description: "Fine Art & Creative Classes — Basking Ridge, NJ",
    type: "website",
    siteName: "Luna Art studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luna Art studio",
    description: "Fine Art & Creative Classes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} ${dmMono.variable}`}
    >
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
