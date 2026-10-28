import type { Metadata } from "next";
import { INDEX } from "@/lib/site";
import Link from "next/link";
import { Crumbs } from "@/components/ui";
import { makes } from "@/lib/data";

export const metadata: Metadata = {
  title: "Wiper Blade Sizes by Car Make",
  description: "Pick your car's make to find wiper blade sizes for every model and year.",
  robots: INDEX,
  alternates: { canonical: "/makes/" },
};

export default function MakesPage() {
  return (
    <>
      <Crumbs items={[{ name: "Home", href: "/" }, { name: "All makes" }]} />
      <div className="wrap prose" style={{ maxWidth: "var(--wrap)" }}>
        <h1 style={{ marginTop: 16 }}>Wiper blade sizes by make</h1>
        <div className="grid" style={{ marginTop: 24 }}>
          {makes().map((m) => (
            <Link key={m.makeSlug} href={`/${m.makeSlug}/`} className="tile">
              <strong>{m.make}</strong>
              <span>{m.models.size} models</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
