import Image from "next/image";
import Link from "next/link";
import { mm, type Vehicle } from "@/lib/data";

export const IconWiper = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M4 26a16 16 0 0 1 24 0" strokeOpacity=".45" />
    <path d="M16 27 7 9" />
    <path d="m5.5 12 4-7" strokeWidth="3" />
    <circle cx="16" cy="27" r="2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m4 10.5 4 4 8-9" />
  </svg>
);

export const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="10" cy="10" r="8" />
    <path d="M10 9v5M10 6.2v.1" />
  </svg>
);

export function Crumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav className="crumbs wrap" aria-label="Breadcrumb">
      <ol>
        {items.map((c) => (
          <li key={c.name}>{c.href ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/** The size readout: one box per blade, with a bar drawn to scale against 32". The rear box only shows when a rear size is listed. */
export function Gauge({ v }: { v: Vehicle }) {
  const boxes = [
    { label: "Driver", sizes: v.driver },
    { label: "Passenger", sizes: v.passenger },
    { label: "Rear", sizes: v.rear },
  ].filter((b) => b.sizes.length);
  return (
    <section className="sizes" aria-label={`Wiper blade sizes for the ${v.year} ${v.make} ${v.model}`}>
      <h2 className="sizes-title">Your wiper sizes</h2>
      <div className="sizes-grid" style={{ "--n": boxes.length } as React.CSSProperties}>
        {boxes.map((b) => (
          <div className={b.label === "Rear" ? "size-box size-rear" : "size-box"} key={b.label}>
            <span className="size-label">{b.label}</span>
            <span className={b.sizes.length > 1 ? "size-num size-two" : "size-num"}>
              {b.sizes.join(" / ")}
              <small>in</small>
            </span>
            <span className="size-mm">{b.sizes.map((n) => `${mm(n)} mm`).join(" / ")}</span>
            <span className="size-bar" aria-hidden="true">
              <span style={{ width: `${(Math.max(...b.sizes) / 32) * 100}%` }} />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/** A local image from public/images at its real size; lazy unless `preload` (above the fold). */
export function Figure({ src, alt, w = 1200, h = 800, preload }: { src: string; alt: string; w?: number; h?: number; preload?: boolean }) {
  return (
    <figure className="fig">
      <Image src={src} alt={alt} width={w} height={h} sizes="(max-width: 800px) 100vw, 760px" preload={preload} />
    </figure>
  );
}
