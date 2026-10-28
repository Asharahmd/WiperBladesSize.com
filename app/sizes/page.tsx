import type { Metadata } from "next";
import { INDEX } from "@/lib/site";
import Link from "next/link";
import { Crumbs } from "@/components/ui";
import { mm, sizeIndex } from "@/lib/data";

export const metadata: Metadata = {
  title: "Which Cars Use Each Wiper Blade Size?",
  description: "Pick a blade length to see every car, truck and SUV that uses it as a driver, passenger or rear blade.",
  robots: INDEX,
  alternates: { canonical: "/sizes/" },
};

export default function SizesPage() {
  return (
    <>
      <Crumbs items={[{ name: "Home", href: "/" }, { name: "Cars by blade size" }]} />
      <div className="wrap prose" style={{ maxWidth: "var(--wrap)" }}>
        <h1 style={{ marginTop: 16 }}>Which cars use each wiper blade size?</h1>
        <p>Have a spare blade, or a size printed on your old one? Pick the length to see the vehicles that take it.</p>
        <div className="grid" style={{ marginTop: 24 }}>
          {[...sizeIndex()].map(([s, list]) => (
            <Link key={s} href={`/sizes/${s}-inch/`} className="tile">
              <strong className="num">{s} inch</strong>
              <span>
                {mm(s)} mm, {new Set(list.map((v) => v.make + v.model)).size} models
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
