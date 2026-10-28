import type { Metadata } from "next";
import { NOINDEX } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs } from "@/components/ui";
import { inch, modelYears, runLabel, runs, vehiclePath, vehicles } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...new Set(vehicles.map((v) => `${v.makeSlug}/${v.modelSlug}`))].map((k) => {
    const [make, model] = k.split("/");
    return { make, model };
  });
}

async function load(params: PageProps<"/[make]/[model]">["params"]) {
  const { make, model } = await params;
  const years = modelYears(make, model);
  return years.length ? years : notFound();
}

export async function generateMetadata({ params }: PageProps<"/[make]/[model]">): Promise<Metadata> {
  const years = await load(params);
  const { make, model } = years[0];
  const span = `${years.at(-1)!.year}–${years[0].year}`;
  return {
    title: `${make} ${model} Wiper Blade Sizes by Year (${span})`,
    description: `Driver, passenger and rear wiper blade sizes for every ${make} ${model} from ${span}, grouped by the years that share a size.`,
    alternates: { canonical: `/${years[0].makeSlug}/${years[0].modelSlug}/` },
    // Launch phase: noindex. On release use years.some((v) => v.verified) ? INDEX : NOINDEX (and an explicit value, since undefined drops the layout default).
    robots: NOINDEX,
  };
}

export default async function ModelPage({ params }: PageProps<"/[make]/[model]">) {
  const years = await load(params);
  const { make, model, makeSlug } = years[0];
  const groups = runs(years);

  return (
    <>
      <Crumbs items={[{ name: "Home", href: "/" }, { name: make, href: `/${makeSlug}/` }, { name: model }]} />
      <div className="wrap prose" style={{ maxWidth: "var(--wrap)" }}>
        <h1 style={{ marginTop: 16 }}>
          {make} {model} wiper blade sizes by year
        </h1>
        <p>
          The {model} has used {groups.length} different blade setups between {years.at(-1)!.year} and {years[0].year}. The
          newest, for {runLabel(groups[0])} models, is a {inch(groups[0][0].driver)} driver blade and a{" "}
          {inch(groups[0][0].passenger)} passenger blade. Pick your year for the full details and the blades that fit.
        </p>

        <div className="table-wrap" style={{ margin: "24px 0" }}>
          <table>
            <thead>
              <tr>
                <th>Model years</th>
                <th>Driver</th>
                <th>Passenger</th>
                <th>Rear</th>
                <th>Connector</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((r) => (
                <tr key={r[0].year}>
                  <td>
                    <strong>{runLabel(r)}</strong>
                  </td>
                  <td>{inch(r[0].driver)}</td>
                  <td>{inch(r[0].passenger)}</td>
                  <td>{r[0].rear.length ? inch(r[0].rear) : "Not listed"}</td>
                  <td>{r[0].armType || "Not listed"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Choose your model year</h2>
        <div className="grid">
          {years.map((v) => (
            <Link key={v.year} href={vehiclePath(v)} className="tile">
              <strong className="num">{v.year}</strong>
              <span>
                {inch(v.driver)} / {inch(v.passenger)}
                {v.rear.length ? ` / rear ${inch(v.rear)}` : ""}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
