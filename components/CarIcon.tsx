import type { Body } from "@/lib/body";

// Side view per body type: [body, windows]. Front of the car faces right.
const SHAPES: Record<Body, [string, string]> = {
  sedan: [
    "M6 40v-6c0-4 3-6 8-7l20-3 14-11c3-2 6-3 10-3h20c4 0 7 1 10 4l11 10 16 3c5 1 7 3 7 7v6z",
    "M40 24l11-9c2-1 4-2 7-2h9v11zM71 13h6c3 0 5 1 7 3l8 8H71z",
  ],
  hatch: [
    "M6 40v-5c0-3 2-5 6-6l7-2 7-12c2-3 5-5 9-5h28c4 0 7 1 10 4l11 11 16 3c5 1 7 3 7 7v5z",
    "M27 25l6-10c1-2 3-3 5-3h21v13zM63 12h9c3 0 5 1 7 3l9 10H63z",
  ],
  coupe: [
    "M6 40v-5c0-3 2-5 7-6l22-4 16-9c3-2 7-3 11-3h14c5 0 9 2 12 5l8 7 13 3c4 1 6 3 6 6v6z",
    "M42 25l12-7c2-1 4-2 7-2h6v9zM71 16h5c4 0 7 1 9 4l4 5H71z",
  ],
  suv: [
    "M6 40V24c0-3 2-5 5-5l5-1 4-9c1-2 3-3 6-3h52c4 0 7 2 9 4l9 10 13 2c4 1 6 3 6 6v12z",
    "M22 19l4-9c1-1 2-2 4-2h16v11zM50 8h20v11H50zM74 8h4c3 0 5 1 7 3l7 8H74z",
  ],
  pickup: [
    "M6 40V25c0-2 1-3 3-3h43V9c0-2 2-4 4-4h20c3 0 5 1 7 3l11 13 16 2c4 1 6 3 6 6v11z",
    "M58 9h16c2 0 3 1 4 2l9 10H58z",
  ],
  minivan: [
    "M6 40V20c0-7 4-13 11-14l52-1c6 0 10 2 13 5l14 12 12 3c4 1 6 3 6 6v9z",
    "M14 11h18v10H12v-4c0-3 1-5 2-6zM36 10h20v11H36zM60 10h9c3 0 5 1 7 3l8 8H60z",
  ],
  van: [
    "M6 40V9c0-3 2-5 5-5h70c4 0 7 1 9 4l12 15 10 2c3 1 4 3 4 6v9z",
    "M70 9h10c2 0 4 1 5 3l8 10H70z",
  ],
  truck: [
    "M6 40V5h66v35zM76 40V11c0-2 2-4 4-4h14c3 0 5 1 6 3l8 13 4 2c2 1 2 2 2 4v11z",
    "M82 11h11c2 0 3 1 4 2l6 10H82z",
  ],
};

export default function CarIcon({ body, className }: { body: Body; className?: string }) {
  const [shape, glass] = SHAPES[body];
  return (
    <svg className={className} viewBox="0 0 120 52" aria-hidden="true">
      <path d={shape} fill="var(--navy)" />
      <path d={glass} fill="var(--navy-ink)" />
      {[28, 92].map((x) => (
        <g key={x}>
          <circle cx={x} cy="41" r="9" fill="var(--ink)" stroke="var(--paper)" strokeWidth="2" />
          <circle cx={x} cy="41" r="3.5" fill="var(--line)" />
        </g>
      ))}
    </svg>
  );
}
