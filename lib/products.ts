import { amazonUrl, inch, mm, vehicleName, type Vehicle } from "./data";

export type BladeType = "beam" | "hybrid" | "conventional" | "rear";

export type Card = {
  id: string;
  brand: string;
  title: string;
  type: BladeType;
  blades: number[];
  features: string[];
  sizes: { label: string; value: string }[];
  links: { label: string; href: string }[];
};

export type Tab = { id: "set" | "pair" | "rear"; label: string; cards: Card[] };

const FEATURES: Record<Exclude<BladeType, "rear">, string[]> = {
  beam: [
    "One-piece spring steel beam with no exposed frame, so snow and ice have less to grab.",
    "Low profile that stays flat on the glass at highway speed.",
    "Costs more than a conventional blade.",
  ],
  hybrid: [
    "Steel frame under a plastic shell, so it presses like a framed blade and looks like a beam.",
    "The shell keeps snow out of the joints.",
    "Usually priced between beam and conventional blades.",
  ],
  conventional: [
    "Metal frame that presses the rubber down at several points.",
    "The cheapest type and sold in almost every store.",
    "The frame joints can clog with snow and ice in winter.",
  ],
};

const FRONT = [
  { brand: "Bosch", line: "ICON", type: "beam" },
  { brand: "Rain-X", line: "Latitude", type: "beam" },
  { brand: "Michelin", line: "Stealth Ultra", type: "hybrid" },
  { brand: "Rain-X", line: "Weatherbeater", type: "conventional" },
] as const;

const REAR = ["Bosch", "Rain-X", "Trico"];

const size = (label: string, s: number) => ({ label, value: `${s}" (${mm(s)} mm)` });

export function bladeTabs(v: Vehicle, connector?: string): Tab[] {
  const name = vehicleName(v);
  const pairs = v.driver.flatMap((d) => v.passenger.map((p) => [d, p] as const));
  const fitNote = connector ? `Check that the pack includes a ${connector} adapter, which is what the ${v.model} uses.` : null;
  const rearSizes = v.rear.map((r) => size("Rear", r));

  const front = (withRear: boolean) =>
    FRONT.flatMap((b) =>
      pairs.map(([d, p]) => {
        const product = `${b.brand} ${b.line}`;
        return {
          id: `${b.brand}-${b.line}-${d}-${p}-${withRear}`,
          brand: b.brand,
          title: withRear ? `${product} front pair + rear blade` : `${product} front pair`,
          type: b.type,
          blades: withRear ? [d, p, v.rear[0]] : [d, p],
          features: [...FEATURES[b.type], ...(fitNote ? [fitNote] : [])],
          sizes: [size("Driver", d), size("Passenger", p), ...(withRear ? rearSizes : [])],
          links: [
            { label: "Front pair on Amazon", href: amazonUrl(`${product} ${d} inch ${p} inch wiper blades`) },
            ...(withRear ? [{ label: "Rear blade on Amazon", href: amazonUrl(`${b.brand} rear wiper blade ${name}`) }] : []),
          ],
        };
      }),
    );

  const rear: Card[] = REAR.map((brand) => ({
    id: `rear-${brand}`,
    brand,
    title: `${brand} rear blade for the ${v.model}`,
    type: "rear",
    blades: [v.rear[0]],
    features: [
      `Rear arms differ from model to model, so pick a blade listed for the ${name}.`,
      "Rear blades wear faster than you would expect because they wipe less often and sit in the sun.",
    ],
    sizes: rearSizes,
    links: [{ label: "Check on Amazon", href: amazonUrl(`${brand} rear wiper blade ${name}`) }],
  }));

  const tabs: Tab[] = [{ id: "pair", label: "Front pairs", cards: front(false) }];
  if (v.rear.length) {
    tabs.unshift({ id: "set", label: "Front & rear sets", cards: front(true) });
    tabs.push({ id: "rear", label: `Rear blade ${inch(v.rear)}`, cards: rear });
  }
  return tabs;
}
