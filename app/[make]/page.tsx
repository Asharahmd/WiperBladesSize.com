import type { Metadata } from "next";
import { NOINDEX } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs } from "@/components/ui";
import { inch, makes, models } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return makes().map((m) => ({ make: m.makeSlug }));
}

async function load(params: PageProps<"/[make]">["params"]) {
  const { make } = await params;
  const list = models(make);
  return list.length ? { name: list[0].years[0].make, slug: make, list } : notFound();
}

export async function generateMetadata({ params }: PageProps<"/[make]">): Promise<Metadata> {
  const { name, slug, list } = await load(params);
  return {
    title: `${name} Wiper Blade Sizes: Every Model by Year`,
    description: `Wiper blade sizes for ${list.length} ${name} models, with driver, passenger and rear lengths for each model year.`,
    alternates: { canonical: `/${slug}/` },
    // Launch phase: noindex. On release use list.some((m) => m.years.some((v) => v.verified)) ? INDEX : NOINDEX (and an explicit value, since undefined drops the layout default).
    robots: NOINDEX,
  };
}

export default async function MakePage({ params }: PageProps<"/[make]">) {
  const { name, slug, list } = await load(params);
  return (
    <>
      <Crumbs items={[{ name: "Home", href: "/" }, { name }]} />
      <div className="wrap prose" style={{ maxWidth: "var(--wrap)" }}>
        <h1 style={{ marginTop: 16 }}>{name} wiper blade sizes</h1>
        <p>Choose your {name} to see the blade sizes for each model year. The sizes shown below are for the newest year we list.</p>
        <div className="grid" style={{ marginTop: 24 }}>
          {list.map((m) => {
            const v = m.years[0];
            return (
              <Link key={m.modelSlug} href={`/${slug}/${m.modelSlug}/`} className="tile">
                <strong>{m.model}</strong>
                <span>
                  {v.year}: {inch(v.driver)} / {inch(v.passenger)}
                  {v.rear.length ? ` / rear ${inch(v.rear)}` : ""}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
