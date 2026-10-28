import type { Metadata, Viewport } from "next";
import { Barlow, Figtree } from "next/font/google";
import { Footer, Header } from "@/components/Chrome";
import { SITE } from "@/lib/site";
import "./globals.css";

const barlow = Barlow({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-barlow", display: "swap" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Wiper Blade Size Finder by Year, Make & Model | WiperBladesSize",
    template: "%s | WiperBladesSize",
  },
  description: "Find the driver, passenger and rear wiper blade sizes for your car, truck or SUV, with connector type and sizes in inches and mm.",
  openGraph: {
    siteName: SITE.name,
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/og-default.webp", width: 1200, height: 630, alt: "Windshield wipers on a wet windshield" }],
  },
  twitter: { card: "summary_large_image" },
  // Noindex by default during launch; the pages in SITE's INDEXED list opt back in.
  robots: { index: false, follow: true },
};

export const viewport: Viewport = { themeColor: "#0a2240" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${barlow.variable} ${figtree.variable}`}>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
