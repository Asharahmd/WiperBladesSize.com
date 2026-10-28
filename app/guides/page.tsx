import type { Metadata } from "next";
import { INDEX } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import { Crumbs } from "@/components/ui";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Wiper Blade Guides",
  description: "How to measure, change and choose wiper blades, plus winter and rear wiper tips.",
  robots: INDEX,
  alternates: { canonical: "/guides/" },
};

export default function GuidesPage() {
  return (
    <>
      <Crumbs items={[{ name: "Home", href: "/" }, { name: "Guides" }]} />
      <div className="wrap prose" style={{ maxWidth: "var(--wrap)" }}>
        <h1 style={{ marginTop: 16 }}>Wiper blade guides</h1>
        <div className="grid" style={{ marginTop: 24 }}>
          {guides.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}/`} className="tile">
              <Image className="tile-img" src={g.cover} alt="" width={1200} height={800} sizes="(max-width: 600px) 100vw, 360px" />
              <strong>{g.h1}</strong>
              <span>{g.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
