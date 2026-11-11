import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mrdimsum.vercel.app"),
  title: `${siteConfig.name} - ${siteConfig.tagline} | ${siteConfig.taglineSub}`,
  description: `${siteConfig.aboutShort} Nikmati variasi dimsum kukus dan goreng buatan tangan tanpa bahan pengawet di Jonggol.`,
  keywords: ["dimsum jonggol", "mr dimsum", "dimsum halal", "dimsum artisan", "kuliner jonggol", "dimsum bogor"],
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.aboutShort,
    url: "https://mrdimsum.vercel.app",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.logo,
        width: 800,
        height: 800,
        alt: `${siteConfig.name} Logo`,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-surface text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
