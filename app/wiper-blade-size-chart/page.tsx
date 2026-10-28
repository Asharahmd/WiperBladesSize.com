import type { Metadata } from "next";
import { INDEX } from "@/lib/site";
import Link from "next/link";
import { Crumbs } from "@/components/ui";
import { inch, makes, models, runLabel, runs, vehiclePath } from "@/lib/data";

export const metadata: Metadata = {
  title: "Wiper Blade Size Chart for Cars, Trucks & SUVs",
  description: "One chart with driver, passenger and rear wiper blade sizes for popular US vehicles, grouped by make, model and years.",
  robots: INDEX,
  alternates: { canonical: "/wiper-blade-size-chart/" },
};

export default function ChartPage() {
  return (
    <>
      <Crumbs items={[{ name: "Home", href: "/" }, { name: "Size chart" }]} />
      <div className="wrap prose" style={{ maxWidth: "var(--wrap)" }}>
        <h1 style={{ marginTop: 16 }}>Wiper blade size chart</h1>
        <p>
          Every vehicle we cover in one table. Rows group the model years that share the same sizes. Click a row for connector
          details and blades that fit.
        </p>
        {makes().map((mk) => (
          <section key={mk.makeSlug}>
            <h2 id={mk.makeSlug}>{mk.make}</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Years</th>
                    <th>Driver</th>
                    <th>Passenger</th>
                    <th>Rear</th>
                  </tr>
                </thead>
                <tbody>
                  {models(mk.makeSlug).flatMap((m) =>
                    runs(m.years).map((r) => (
                      <tr key={m.modelSlug + r[0].year}>
                        <td>
                          <Link href={vehiclePath(r[0])}>{m.model}</Link>
                        </td>
                        <td>{runLabel(r)}</td>
                        <td>{inch(r[0].driver)}</td>
                        <td>{inch(r[0].passenger)}</td>
                        <td>{r[0].rear.length ? inch(r[0].rear) : "Not listed"}</td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
