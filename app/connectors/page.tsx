import type { Metadata } from "next";
import { INDEX } from "@/lib/site";
import { Crumbs, Figure } from "@/components/ui";
import { CONNECTORS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Wiper Blade Connector Types: J-Hook, Push Button, Pinch Tab & More",
  description: "How to tell which wiper arm connector your car has, so the new blade clips on the first time.",
  robots: INDEX,
  alternates: { canonical: "/connectors/" },
};

export default function ConnectorsPage() {
  return (
    <>
      <Crumbs items={[{ name: "Home", href: "/" }, { name: "Connector types" }]} />
      <div className="wrap prose">
        <h1 style={{ marginTop: 16 }}>Wiper blade connector types</h1>
        <p>
          The connector is the joint where the blade meets the wiper arm. A blade of the right length still won&apos;t fit if the
          connector is wrong. Lift your wiper arm and compare its tip with the descriptions below. Most aftermarket blades ship with
          adapters for the common types, and the box lists which ones.
        </p>
        {Object.entries(CONNECTORS).map(([slug, c]) => (
          <section key={slug}>
            <h2 id={slug}>{c.name}</h2>
            <div className="conn">
              <Figure src={`/images/connectors/${slug}.webp`} alt={c.alt} w={800} h={800} />
              <p>{c.blurb}</p>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
