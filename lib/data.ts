import raw from "@/data/vehicles.json";
import { SITE } from "./site";

export type Vehicle = {
  make: string;
  makeSlug: string;
  model: string;
  modelSlug: string;
  year: number;
  driver: number[];
  passenger: number[];
  rear: number[];
  connector: string | null;
  armType: string;
  rearArmType?: string;
  sources: string[];
  refs: string[];
  verified: boolean;
  rearVerified: boolean;
};

export const vehicles = raw as Vehicle[];

export const SOURCES: Record<string, string> = {
  rainx: "Rain-X fitment data",
  uk_acp: "WiperBlades.co.uk fitment list",
  autofiles: "AutoFiles.com size tables",
  oximo: "OXIMO wiper fitment catalog",
  manual: "a second US fitment database, checked by hand",
  manual_extra: "another published size list, checked by hand",
};

export const CONNECTORS: Record<string, { name: string; blurb: string; alt: string }> = {
  "j-hook": {
    name: "J-hook",
    alt: "Wiper arm ending in a U-shaped J-hook",
    blurb: "The arm ends in a U-shaped hook. Most US cars use it. The blade's adapter slides into the hook and clicks.",
  },
  "push-button": {
    name: "Push button",
    alt: "Wiper arm end with a release button showing through the top",
    blurb: "A flat arm end with a button on top. Press the button and the blade slides off the arm.",
  },
  "pinch-tab": {
    name: "Pinch tab",
    alt: "Wiper arm with a pinch-tab adapter on its end",
    blurb: "Two tabs on the blade's adapter. Squeeze them together and lift the blade off the arm.",
  },
  "side-pin": {
    name: "Side pin",
    alt: "Wiper arm with a pin sticking out of its side",
    blurb: "A pin sticks out from the side of the arm. The blade clips onto the pin, common on older GM and some European cars.",
  },
  bayonet: {
    name: "Bayonet",
    alt: "Narrow flat bayonet-style wiper arm end",
    blurb: "A narrow flat arm that slides into the blade's adapter. Seen on older Asian imports.",
  },
  "top-lock": {
    name: "Top lock",
    alt: "Flat wiper arm end with a top-lock adapter",
    blurb: "A flat arm end that locks from the top, used on many newer GM vehicles.",
  },
};

/** Connector name mid-sentence: "a J-hook connector", "a push button connector". */
export const connName = (c: { name: string }) => (c.name.startsWith("J-") ? c.name : c.name.toLowerCase());

export const sameSize =(a: Vehicle, b: Vehicle) =>
  a.driver.join() === b.driver.join() && a.passenger.join() === b.passenger.join() && a.rear.join() === b.rear.join();

const byKey = new Map(vehicles.map((v) => [`${v.makeSlug}/${v.modelSlug}/${v.year}`, v]));

export const getVehicle = (make: string, model: string, year: number) => byKey.get(`${make}/${model}/${year}`);

export function makes() {
  const m = new Map<string, { make: string; makeSlug: string; models: Set<string> }>();
  for (const v of vehicles) {
    const e = m.get(v.makeSlug) ?? { make: v.make, makeSlug: v.makeSlug, models: new Set() };
    e.models.add(v.modelSlug);
    m.set(v.makeSlug, e);
  }
  return [...m.values()].sort((a, b) => a.make.localeCompare(b.make));
}

export function models(makeSlug: string) {
  const m = new Map<string, { model: string; modelSlug: string; years: Vehicle[] }>();
  for (const v of vehicles.filter((v) => v.makeSlug === makeSlug)) {
    const e = m.get(v.modelSlug) ?? { model: v.model, modelSlug: v.modelSlug, years: [] };
    e.years.push(v);
    m.set(v.modelSlug, e);
  }
  for (const e of m.values()) e.years.sort((a, b) => b.year - a.year);
  return [...m.values()].sort((a, b) => a.model.localeCompare(b.model));
}

export const modelYears = (makeSlug: string, modelSlug: string) =>
  vehicles.filter((v) => v.makeSlug === makeSlug && v.modelSlug === modelSlug).sort((a, b) => b.year - a.year);

/** Consecutive years with identical sizes, newest first: the "generation" a year belongs to. */
export function runs(years: Vehicle[]) {
  const out: Vehicle[][] = [];
  for (const v of years) {
    const last = out.at(-1);
    if (last && sameSize(last[0], v) && last.at(-1)!.year - v.year === 1) last.push(v);
    else out.push([v]);
  }
  return out;
}

export const runLabel = (run: Vehicle[]) =>
  run.length === 1 ? `${run[0].year}` : `${run.at(-1)!.year}–${run[0].year}`;

/** Every blade length in use, with the vehicles that take it at any position. */
export function sizeIndex() {
  const idx = new Map<number, Vehicle[]>();
  for (const v of vehicles)
    for (const s of new Set([...v.driver, ...v.passenger, ...v.rear])) idx.set(s, [...(idx.get(s) ?? []), v]);
  return new Map([...idx.entries()].sort((a, b) => a[0] - b[0]));
}

export const inch = (sizes: number[]) => (sizes.length ? sizes.map((s) => `${s}"`).join(" or ") : "None");
export const mm = (s: number) => Math.round((s * 25.4) / 5) * 5;
export const vehicleName = (v: Vehicle) => `${v.year} ${v.make} ${v.model}`;
export const vehiclePath = (v: Pick<Vehicle, "makeSlug" | "modelSlug" | "year">) => `/${v.makeSlug}/${v.modelSlug}/${v.year}/`;

export function amazonUrl(query: string) {
  const u = new URL("https://www.amazon.com/s");
  u.searchParams.set("k", query);
  if (SITE.amazonTag) u.searchParams.set("tag", SITE.amazonTag);
  return u.toString();
}
