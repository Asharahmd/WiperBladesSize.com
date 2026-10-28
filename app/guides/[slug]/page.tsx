import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs, Figure, JsonLd } from "@/components/ui";
import { getGuide, guides } from "@/lib/guides";
import { SITE } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

async function load(params: PageProps<"/guides/[slug]">["params"]) {
  return getGuide((await params).slug) ?? notFound();
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const g = await load(params);
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}/` },
    openGraph: { type: "article", siteName: SITE.name, images: [{ url: g.cover, width: 1200, height: 800, alt: g.coverAlt }] },
  };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const g = await load(params);
  const others = guides.filter((o) => o.slug !== g.slug);
  return (
    <>
      <Crumbs items={[{ name: "Home", href: "/" }, { name: "Guides", href: "/guides/" }, { name: g.h1 }]} />
      <div className="wrap prose">
        <h1 style={{ marginTop: 16 }}>{g.h1}</h1>
        <Figure src={g.cover} alt={g.coverAlt} preload />
        {g.body}
        <p>
          <Link href="/#finder">Find the blade sizes for your car</Link>
        </p>
        <h2>More guides</h2>
        <ul>
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/guides/${o.slug}/`}>{o.h1}</Link>
            </li>
          ))}
        </ul>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.h1,
          description: g.description,
          image: SITE.url + g.cover,
          mainEntityOfPage: `${SITE.url}/guides/${g.slug}/`,
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
        }}
      />
    </>
  );
}
