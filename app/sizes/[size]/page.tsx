import type { Metadata } from "next";
import { NOINDEX } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs } from "@/components/ui";
import { mm, runLabel, runs, sizeIndex, vehiclePath, type Vehicle } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...sizeIndex().keys()].map((s) => ({ size: `${s}-inch` }));
}

async function load(params: PageProps<"/sizes/[size]">["params"]) {
  const { size } = await params;
  const s = parseInt(size);
  const list = sizeIndex().get(s);
  return list ? { s, list } : notFound();
}

export async function generateMetadata({ params }: PageProps<"/sizes/[size]">): Promise<Metadata> {
  const { s } = await load(params);
  return {
    title: `What Cars Use ${s} Inch Wiper Blades? (${mm(s)} mm)`,
    description: `Every car, truck and SUV that takes a ${s}" (${mm(s)} mm) wiper blade, by position and model year.`,
    alternates: { canonical: `/sizes/${s}-inch/` },
    // Launch phase: noindex. On release use list.some((v) => v.verified) ? INDEX : NOINDEX (and an explicit value, since undefined drops the layout default).
    robots: NOINDEX,
  };
}

export default async function SizePage({ params }: PageProps<"/sizes/[size]">) {
  const { s, list } = await load(params);
  const byModel = new Map<string, Vehicle[]>();
  for (const v of list) byModel.set(`${v.make} ${v.model}`, [...(byModel.get(`${v.make} ${v.model}`) ?? []), v]);
  const where = (v: Vehicle) =>
    [v.driver.includes(s) && "Driver", v.passenger.includes(s) && "Passenger", v.rear.includes(s) && "Rear"].filter(Boolean).join(", ");

  return (
    <>
      <Crumbs items={[{ name: "Home", href: "/" }, { name: "Sizes", href: "/sizes/" }, { name: `${s} inch` }]} />
      <div className="wrap prose" style={{ maxWidth: "var(--wrap)" }}>
        <h1 style={{ marginTop: 16 }}>Cars that use {s} inch wiper blades</h1>
        <p>
          A {s}&quot; blade is about {mm(s)} mm long. These vehicles take it on at least one side. Check the position column: a
          car may need a different length on the other side.
        </p>
        <div className="table-wrap" style={{ marginTop: 24 }}>
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Years</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {[...byModel].sort().flatMap(([name, vs]) =>
                runs(vs.sort((a, b) => b.year - a.year)).map((r) => (
                  <tr key={name + r[0].year}>
                    <td>
                      <Link href={vehiclePath(r[0])}>{name}</Link>
                    </td>
                    <td>{runLabel(r)}</td>
                    <td>{where(r[0])}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
