import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BladePicker from "@/components/BladePicker";
import CarIcon from "@/components/CarIcon";
import { Crumbs, Gauge, IconCheck, IconInfo, JsonLd } from "@/components/ui";
import {
  CONNECTORS, connName, getVehicle, inch, mm, modelYears, runLabel, runs, SOURCES,
  vehicleName, vehiclePath, vehicles, type Vehicle,
} from "@/lib/data";
import { BODY_NAME, bodyOf } from "@/lib/body";
import { bladeTabs } from "@/lib/products";
import { NOINDEX, SITE } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return vehicles.map((v) => ({ make: v.makeSlug, model: v.modelSlug, year: String(v.year) }));
}

async function load(params: PageProps<"/[make]/[model]/[year]">["params"]) {
  const { make, model, year } = await params;
  return getVehicle(make, model, Number(year)) ?? notFound();
}

export async function generateMetadata({ params }: PageProps<"/[make]/[model]/[year]">): Promise<Metadata> {
  const v = await load(params);
  return {
    title: `${vehicleName(v)} Wiper Blade Size: Driver, Passenger & Rear`,
    description: `${summary(v)} Sizes in inches and mm, plus the connector type and blades that fit.`,
    alternates: { canonical: vehiclePath(v) },
    // Single-source sizes stay out of the index until a second source agrees.
    // Launch phase: noindex. On release use v.verified ? INDEX : NOINDEX (and an explicit value, since undefined drops the layout default).
    robots: NOINDEX,
  };
}

function summary(v: Vehicle) {
  const rear = v.rear.length ? ` and a ${inch(v.rear)} rear blade` : "";
  return `The ${vehicleName(v)} uses a ${inch(v.driver)} driver blade, a ${inch(v.passenger)} passenger blade${rear}.`;
}

export default async function VehiclePage({ params }: PageProps<"/[make]/[model]/[year]">) {
  const v = await load(params);
  const name = vehicleName(v);
  const body = bodyOf(v.make, v.model);
  const conn = v.connector ? CONNECTORS[v.connector] : undefined;
  const years = modelYears(v.makeSlug, v.modelSlug);
  const run = runs(years).find((r) => r.includes(v))!;
  const mixed = v.driver.length > 1 || v.passenger.length > 1;
  const twins = v.driver.join() === v.passenger.join();
  const alike = vehicles
    .filter((o) => o.year === v.year && o.modelSlug !== v.modelSlug && o.driver.join() === v.driver.join() && o.passenger.join() === v.passenger.join())
    .slice(0, 6);

  const faqs = [
    { q: `What size wiper blades does a ${name} need?`, a: summary(v) },
    {
      q: `Are the ${name} driver and passenger blades the same size?`,
      a: twins
        ? `Yes. Both front blades are ${inch(v.driver)}.`
        : `No. The driver blade is ${inch(v.driver)} and the passenger blade is ${inch(v.passenger)}, so buy one of each length.`,
    },
    {
      q: `Does the ${name} have a rear wiper?`,
      a: v.rear.length
        ? `Yes. The rear wiper takes a ${inch(v.rear)} blade. Rear arms vary, so buy a rear blade listed for your exact model.`
        : `Our sources list no rear wiper blade for the ${name}.`,
    },
    ...(conn ? [{ q: `What wiper arm connector does the ${name} use?`, a: `The front arms use a ${connName(conn)} connector. ${conn.blurb}` }] : []),
  ];

  return (
    <>
      <Crumbs
        items={[
          { name: "Home", href: "/" },
          { name: v.make, href: `/${v.makeSlug}/` },
          { name: v.model, href: `/${v.makeSlug}/${v.modelSlug}/` },
          { name: String(v.year) },
        ]}
      />
      <div className="wrap vbar">
        <strong className="vbar-label">Your vehicle</strong>
        <div className="vbar-car">
          <CarIcon body={body} className="vbar-icon" />
          <span>
            <strong>{name}</strong>
            <span className="muted">{BODY_NAME[body]}</span>
          </span>
        </div>
        <span className={v.verified ? "vbar-badge vbar-ok" : "vbar-badge vbar-warn"}>
          {v.verified ? <IconCheck /> : <IconInfo />} {v.verified ? "Sizes verified" : "Sizes from 1 source"}
        </span>
        <Link href="/#finder" className="vbar-change">Change vehicle</Link>
      </div>
      <div className="wrap layout">
        <article>
          <h1 style={{ marginTop: 16 }}>{name} wiper blade size</h1>
          <p style={{ fontSize: "1.1rem" }}>
            {summary(v)} {conn && <>The front arms use a {connName(conn)} connector.</>}
          </p>

          <Gauge v={v} />

          {mixed && (
            <div className="status status-warn">
              <IconInfo />
              <span>Two lengths are listed for this year because body styles differ. Measure your old blade to see which one you have.</span>
            </div>
          )}
          {v.verified ? (
            <div className="status status-ok">
              <IconCheck />
              <span>
                Front blade sizes checked against {v.sources.length} independent sources: {v.sources.map((s) => SOURCES[s] ?? s).join(" and ")}.
                {v.rear.length > 0 && !v.rearVerified && " The rear size comes from one source, so check your old rear blade before buying."}
              </span>
            </div>
          ) : (
            <div className="status status-warn">
              <IconInfo />
              <span>
                Checked against 1 source so far ({SOURCES[v.sources[0]] ?? v.sources[0]}). We mark a size as verified once a second
                source agrees. <Link href="/methodology/">How we check sizes</Link>
              </span>
            </div>
          )}

          <p>
            Check against your old blades: measure the rubber strip from end to end. The driver blade should read {inch(v.driver)}{" "}
            ({v.driver.map((s) => `${mm(s)} mm`).join(" or ")}) and the passenger blade {inch(v.passenger)} (
            {v.passenger.map((s) => `${mm(s)} mm`).join(" or ")}). <Link href="/guides/how-to-measure-wiper-blades/">How to measure</Link>
          </p>

          <div className="facts">
            <div className="fact">
              <span>Connector</span>
              <strong>{conn ? <Link href={`/connectors/#${v.connector}`}>{conn.name}</Link> : v.armType || "Not listed"}</strong>
            </div>
            <div className="fact">
              <span>Same sizes on</span>
              <strong>{runLabel(run)} models</strong>
            </div>
            <div className="fact">
              <span>Blades to buy</span>
              <strong>{v.rear.length ? "3 (2 front, 1 rear)" : "2 front"}</strong>
            </div>
          </div>

          <h2>Blades that fit the {name}</h2>
          <BladePicker tabs={bladeTabs(v, conn && connName(conn))} fits={`Sizes for the ${name}`} />

          <h2>How to replace the front blades</h2>
          <ol className="steps">
            <li>Lift the wiper arm away from the windshield until it stays upright. Put a towel on the glass in case the arm snaps back.</li>
            <li>
              {conn ? conn.blurb : "Find the clip where the blade meets the arm."} Remove the old blade.
            </li>
            <li>Slide the new blade onto the arm until it clicks, then tug it gently to make sure it is locked.</li>
            <li>Lower the arm and repeat on the other side. The driver blade is the longer one.</li>
          </ol>
          <p>
            More help: <Link href="/guides/how-to-change-wiper-blades/">changing blades by connector type</Link>,{" "}
            <Link href="/guides/beam-vs-conventional-vs-hybrid/">beam vs conventional vs hybrid</Link> and{" "}
            <Link href="/guides/winter-wiper-blades/">blades for snow and ice</Link>.
          </p>

          <h2>{v.make} {v.model} wiper sizes by year</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Years</th>
                  <th>Driver</th>
                  <th>Passenger</th>
                  <th>Rear</th>
                </tr>
              </thead>
              <tbody>
                {runs(years).map((r) => (
                  <tr key={r[0].year}>
                    <td>
                      {r.includes(v) ? <strong>{runLabel(r)}</strong> : <Link href={vehiclePath(r[0])}>{runLabel(r)}</Link>}
                    </td>
                    <td>{inch(r[0].driver)}</td>
                    <td>{inch(r[0].passenger)}</td>
                    <td>{r[0].rear.length ? inch(r[0].rear) : "Not listed"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Questions</h2>
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </article>

        <aside className="aside">
          <div className="aside-box">
            <h3>Other {v.model} years</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {years.map((y) =>
                y.year === v.year ? (
                  <strong key={y.year} className="num">{y.year}</strong>
                ) : (
                  <Link key={y.year} href={vehiclePath(y)} className="num">
                    {y.year}
                  </Link>
                ),
              )}
            </div>
          </div>
          {alike.length > 0 && (
            <div className="aside-box">
              <h3>Same front sizes</h3>
              <ul>
                {alike.map((o) => (
                  <li key={o.modelSlug}>
                    <Link href={vehiclePath(o)}>{vehicleName(o)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { name: "Home", item: SITE.url + "/" },
                { name: v.make, item: `${SITE.url}/${v.makeSlug}/` },
                { name: v.model, item: `${SITE.url}/${v.makeSlug}/${v.modelSlug}/` },
                { name: String(v.year), item: SITE.url + vehiclePath(v) },
              ].map((c, i) => ({ "@type": "ListItem", position: i + 1, ...c })),
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ],
        }}
      />
    </>
  );
}
