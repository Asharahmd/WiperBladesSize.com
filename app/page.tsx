import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Finder, { type FinderIndex } from "@/components/Finder";
import { IconCheck, JsonLd } from "@/components/ui";
import { amazonUrl, CONNECTORS, inch, makes, vehicleName, vehiclePath, vehicles, type Vehicle } from "@/lib/data";
import { BODY_NAME, bodyOf, type Body } from "@/lib/body";
import { guides } from "@/lib/guides";
import { INDEX, SITE } from "@/lib/site";

// Targets "what size windshield wipers do i need", "wiper blade size (finder)" and "wipers for my car".
export const metadata: Metadata = {
  title: { absolute: "What Size Windshield Wipers Do I Need? Wiper Blade Size Finder" },
  description: "Find the wiper blade size for your car: driver, passenger and rear blades by year, make and model, in inches and mm, with the connector type.",
  alternates: { canonical: "/" },
  robots: INDEX,
};

const POPULAR = [
  ["toyota", "rav4"],
  ["honda", "cr-v"],
  ["ford", "f-150"],
  ["toyota", "camry"],
  ["honda", "civic"],
  ["nissan", "rogue"],
  ["chevrolet", "equinox"],
  ["jeep", "wrangler"],
  ["honda", "accord"],
  ["toyota", "corolla"],
  ["chevrolet", "silverado-1500"],
  ["ford", "explorer"],
];

const FEATURES = [
  { name: "Beam", text: "A one-piece spring steel band with no frame. Follows curved glass and sheds snow.", href: "/guides/beam-vs-conventional-vs-hybrid/" },
  { name: "Hybrid", text: "A frame under an aerodynamic shell, for even pressure with a low profile.", href: "/guides/beam-vs-conventional-vs-hybrid/" },
  { name: "Conventional", text: "A metal frame with several pressure points. The lowest price.", href: "/guides/beam-vs-conventional-vs-hybrid/" },
  { name: "Winter", text: "A rubber boot keeps snow and ice out of the frame joints.", href: "/guides/winter-wiper-blades/" },
  { name: "Silicone", text: "Silicone instead of natural rubber. Holds up better in sun and heat.", href: "/guides/beam-vs-conventional-vs-hybrid/#silicone" },
  { name: "Rear", text: "Shorter blades, often with a mount made for one car.", href: "/guides/rear-wiper-blades/" },
];

function finderIndex(): FinderIndex {
  const idx: FinderIndex = {};
  for (const v of vehicles) {
    const byMake = (idx[v.year] ??= {});
    (byMake[v.make] ??= []).push([v.model, v.makeSlug, v.modelSlug]);
  }
  for (const byMake of Object.values(idx)) for (const list of Object.values(byMake)) list.sort((a, b) => a[0].localeCompare(b[0]));
  return idx;
}

/** Most frequent value and how often it occurs. */
function mode<T>(list: T[]): [T, number] {
  const n = new Map<T, number>();
  for (const x of list) n.set(x, (n.get(x) ?? 0) + 1);
  return [...n.entries()].sort((a, b) => b[1] - a[1])[0];
}

// Example cars on the size tiles come from these makes first, so they are names most US buyers know.
const MAINSTREAM = ["toyota", "honda", "ford", "chevrolet", "nissan", "hyundai", "kia", "jeep", "subaru", "mazda", "gmc", "ram", "volkswagen", "dodge"];
const rank = (v: Vehicle) => (MAINSTREAM.indexOf(v.makeSlug) + 1 || 99);

const pct = (part: number, whole: number) => Math.round((part / whole) * 100);

/** Every stat on this page comes from the newest verified year of each model with one length per position. */
function stats() {
  const newest = new Map<string, Vehicle>();
  for (const v of vehicles) {
    if (!v.verified || v.driver.length !== 1 || v.passenger.length !== 1) continue;
    const k = `${v.makeSlug}/${v.modelSlug}`;
    if ((newest.get(k)?.year ?? 0) < v.year) newest.set(k, v);
  }
  const models = [...newest.values()];

  const pairs = new Map<string, Vehicle[]>();
  for (const v of models) pairs.set(`${v.driver[0]}+${v.passenger[0]}`, [...(pairs.get(`${v.driver[0]}+${v.passenger[0]}`) ?? []), v]);
  const topPairs = [...pairs.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 8);

  const byBody = (Object.keys(BODY_NAME) as Body[])
    .map((body) => {
      const list = models.filter((v) => bodyOf(v.make, v.model) === body);
      const drivers = list.map((v) => v.driver[0]);
      const withRear = list.filter((v) => v.rear.length);
      return {
        body,
        count: list.length,
        driver: list.length ? mode(drivers)[0] : 0,
        passenger: list.length ? mode(list.map((v) => v.passenger[0]))[0] : 0,
        min: Math.min(...drivers),
        max: Math.max(...drivers),
        rear: pct(withRear.length, list.length || 1),
        rearSize: withRear.length ? mode(withRear.map((v) => v.rear[0]))[0] : 0,
      };
    })
    .filter((b) => b.count >= 5);

  const withRear = models.filter((v) => v.rear.length);
  return {
    models,
    topPairs,
    byBody,
    driver: mode(models.map((v) => v.driver[0]))[0],
    passenger: mode(models.map((v) => v.passenger[0]))[0],
    rear: mode(withRear.map((v) => v.rear[0]))[0],
    longerDriver: pct(models.filter((v) => v.driver[0] > v.passenger[0]).length, models.length),
    verified: vehicles.filter((v) => v.verified).length,
  };
}

export default function Home() {
  const first = Math.min(...vehicles.map((v) => v.year));
  const latest = Math.max(...vehicles.map((v) => v.year));
  const popular = POPULAR.map(([mk, md]) =>
    vehicles.filter((v) => v.makeSlug === mk && v.modelSlug === md).sort((a, b) => b.year - a.year)[0],
  ).filter(Boolean);
  const sample = popular[0];
  const s = stats();
  const [topPair] = s.topPairs;

  const faqs = [
    {
      q: "What size windshield wipers do I need?",
      a: `It depends on your car. Pick your year, make and model above to get the driver, passenger and rear sizes. Across the ${s.models.length} models we have verified, the most common front pair is ${topPair[0].replace("+", '" driver and ')}" passenger, but many cars differ by an inch or more, so look up your own.`,
    },
    {
      q: "Are the driver and passenger wiper blades the same size?",
      a: `Usually not. ${s.longerDriver}% of the models we list take a longer blade on the driver side. Buy one of each length.`,
    },
    {
      q: "What is the most common wiper blade size?",
      a: `In our verified data the most common driver blade is ${s.driver}", the most common passenger blade is ${s.passenger}" and the most common rear blade is ${s.rear}".`,
    },
    {
      q: "What windshield wipers do I need for my car?",
      a: "You need the right length for each blade and a blade that fits your arm connector. After that, pick the type: beam blades for curved glass and snow, conventional blades for the lowest price, or hybrids in between. All three come in the same lengths.",
    },
    {
      q: "Can I use a wiper blade one inch longer or shorter?",
      a: "An inch shorter fits and clears a little less glass. An inch longer can hit the windshield frame or the other blade, so only fit a longer blade if it is listed for your car.",
    },
    {
      q: "Do all wiper blades fit all cars?",
      a: "No. The blade has to be the right length and has to clip onto your wiper arm. Most US cars use a J-hook arm, and most aftermarket blades include adapters for the common arm types.",
    },
    {
      q: "How often should I replace my wiper blades?",
      a: "Blade makers generally suggest every 6 to 12 months, or sooner if the blades streak, chatter, squeak or have cracked rubber.",
    },
  ];

  return (
    <>
      <section className="hero" id="finder">
        <div className="wrap">
          <div className="hero-top">
            <div>
              <h1>What size windshield wipers do I need?</h1>
              <p>Find the wipers for your car with our wiper blade size finder. Pick the year, make and model to get the driver, passenger and rear blade sizes.</p>
            </div>
            {sample && (
              <Link href={vehiclePath(sample)} className="hero-sample" aria-label={`Example result: ${vehicleName(sample)}`}>
                <span className="muted">Example result</span>
                <strong>{vehicleName(sample)}</strong>
                {(
                  [
                    ["Driver", sample.driver],
                    ["Passenger", sample.passenger],
                  ] as const
                ).map(([label, sizes]) => (
                  <span key={label} className="hero-sample-row">
                    <span>{label}</span>
                    <span className="size-bar" aria-hidden="true">
                      <span style={{ width: `${(sizes[0] / 32) * 100}%` }} />
                    </span>
                    <span className="num">{inch(sizes)}</span>
                  </span>
                ))}
              </Link>
            )}
          </div>
          <Finder index={finderIndex()} />
          <ul className="trust">
            <li><IconCheck /> Driver, passenger and rear</li>
            <li><IconCheck /> Inches, mm and connector type</li>
            <li><IconCheck /> {first} to {latest} models</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 style={{ marginTop: 0 }}>Wiper sizes for popular vehicles</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Passenger</th>
                  <th>Rear</th>
                </tr>
              </thead>
              <tbody>
                {popular.map((v) => (
                  <tr key={v.modelSlug}>
                    <td><Link href={vehiclePath(v)}>{vehicleName(v)}</Link></td>
                    <td>{inch(v.driver)}</td>
                    <td>{inch(v.passenger)}</td>
                    <td>{v.rear.length ? inch(v.rear) : "None"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p><Link href="/wiper-blade-size-chart/">See the full wiper blade size chart</Link></p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <h2 style={{ marginTop: 0 }}>Most common wiper blade sizes</h2>
          <p className="lead">
            The front blade pairs used most often, counted across the newest verified year of {s.models.length} models.
          </p>
          <div className="grid">
            {s.topPairs.map(([pair, list]) => {
              const [d, p] = pair.split("+");
              return (
                <Link key={pair} href={`/sizes/${d}-inch/`} className="tile">
                  <strong>{d}&quot; + {p}&quot;</strong>
                  <span>
                    {list.length} models, such as {[...list].sort((a, b) => rank(a) - rank(b)).slice(0, 2).map((v) => `${v.make} ${v.model}`).join(" and ")}
                  </span>
                </Link>
              );
            })}
          </div>
          <p><Link href="/sizes/">Find cars by blade length</Link></p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 style={{ marginTop: 0 }}>Wiper blade sizes by vehicle type</h2>
          <p className="lead">
            Bigger windshields take longer blades, so the vehicle type gives a rough idea. Always check your exact model before you buy.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Vehicle type</th>
                  <th>Most common front pair</th>
                  <th>Driver blade range</th>
                  <th>Has a rear wiper</th>
                </tr>
              </thead>
              <tbody>
                {s.byBody.map((b) => (
                  <tr key={b.body}>
                    <td>{BODY_NAME[b.body]} <span className="muted">({b.count} models)</span></td>
                    <td>{b.driver}&quot; + {b.passenger}&quot;</td>
                    <td>{b.min === b.max ? `${b.min}"` : `${b.min}" to ${b.max}"`}</td>
                    <td>{b.rear ? `${b.rear}%, usually ${b.rearSize}"` : "None"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <h2 style={{ marginTop: 0 }}>Three ways to find your wiper size</h2>
          <div className="cards">
            <div className="card">
              <h3>Look it up</h3>
              <p>Use the finder at the top of this page. Each car page lists the driver, passenger and rear lengths and the arm type.</p>
              <Link href="#finder">Go to the finder</Link>
            </div>
            <div className="card">
              <h3>Measure the old blades</h3>
              <p>Measure the rubber strip from end to end and round to the nearest inch. Measure both front blades, since they usually differ.</p>
              <Link href="/guides/how-to-measure-wiper-blades/">How to measure</Link>
            </div>
            <div className="card">
              <h3>Check the owner&apos;s manual</h3>
              <p>Many manuals list the blade lengths in the maintenance or specifications section, often in millimeters.</p>
              <Link href="/guides/how-to-measure-wiper-blades/">Converting mm to inches</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 style={{ marginTop: 0 }}>Buying the right blade</h2>
          <div className="cards">
            <div className="card">
              <Image className="card-img" src="/images/home/two-blades.webp" alt="Car windshield with a long driver-side wiper and a shorter passenger-side wiper" width={1200} height={800} sizes="(max-width: 900px) 100vw, 360px" />
              <h3>Two different lengths</h3>
              <p>
                {s.longerDriver}% of the models we list take a longer driver blade than passenger blade. Buying two of the same
                length is the most common mistake: it leaves a streak or lets the blades hit each other.
              </p>
            </div>
            <div className="card">
              <Image className="card-img" src="/images/guides/types/cover.webp" alt="Conventional, beam and hybrid wiper blades side by side" width={1200} height={800} sizes="(max-width: 900px) 100vw, 360px" />
              <h3>Beam, conventional or hybrid</h3>
              <p>
                All three come in the same lengths. Beam blades follow curved glass and shed snow, conventional blades cost the
                least, and hybrids sit in between.
              </p>
              <Link href="/guides/beam-vs-conventional-vs-hybrid/">Compare blade types</Link>
            </div>
            <div className="card">
              <Image className="card-img" src="/images/home/connector.webp" alt="Close-up of a wiper blade clipped onto its arm" width={1200} height={800} sizes="(max-width: 900px) 100vw, 360px" />
              <h3>The right connector</h3>
              <p>
                The blade has to clip onto your arm. Most US cars use a J-hook. Every car page lists the arm type, and most blades
                include adapters.
              </p>
              <Link href="/connectors/">Connector types</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section photo" style={{ "--bg": "url(/images/guides/change/cover.webp)" } as React.CSSProperties}>
        <div className="wrap">
          <h2 style={{ marginTop: 0 }}>How to install your wiper blades</h2>
          <div className="photo-text">
            <p>Changing wiper blades takes a few minutes and no tools. Blade makers suggest new blades every 6 to 12 months.</p>
            <ol>
              <li>Check the rubber for cracks, splits or a hard, rounded edge.</li>
              <li>Replace the blades when they streak, smear, chatter or skip across the glass.</li>
              <li>Replace both front blades together so they wipe evenly.</li>
            </ol>
            <p>The steps depend on how the blade clips onto your wiper arm. Pick your arm type below, or read the <Link href="/guides/how-to-change-wiper-blades/">step-by-step install guide</Link>.</p>
          </div>
          <div className="grid grid-sm">
            {Object.entries(CONNECTORS).map(([slug, c]) => (
              <Link key={slug} href={`/connectors/#${slug}`} className="tile tile-glass">
                <Image className="tile-img tile-sq" src={`/images/connectors/${slug}.webp`} alt="" width={800} height={800} sizes="(max-width: 600px) 50vw, 180px" />
                <strong>{c.name}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section photo photo-right" style={{ "--bg": "url(/images/guides/replace/cover.webp)" } as React.CSSProperties}>
        <div className="wrap">
          <h2 style={{ marginTop: 0 }}>Types of wiper blades</h2>
          <p className="photo-text">
            Every type comes in the same lengths, so the size for your car works with any of them. They differ in how they press the
            rubber onto the glass, how they handle snow and how long they last.
          </p>
          <div className="grid grid-sm">
            {FEATURES.map((f) => (
              <Link key={f.name} href={f.href} className="tile tile-glass">
                <strong>{f.name}</strong>
                <span>{f.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 style={{ marginTop: 0 }}>Where to buy wiper blades</h2>
          <p className="lead">Write down your driver, passenger and rear sizes before you shop. Any brand in the right length and with the right adapter will fit.</p>
          <div className="cards">
            <div className="card">
              <h3>Online</h3>
              <p>Amazon carries every common size and brand. Each car page on this site links to blades in your exact lengths.</p>
              <a href={amazonUrl("wiper blades")} rel="sponsored nofollow noopener" target="_blank">Shop wiper blades on Amazon</a>
            </div>
            <div className="card">
              <h3>Auto parts stores</h3>
              <p>
                AutoZone, Advance Auto Parts, O&apos;Reilly and NAPA stock blades for most cars. Many stores will fit them for free
                when you buy there, so ask at the counter.
              </p>
            </div>
            <div className="card">
              <h3>Big-box stores</h3>
              <p>Walmart, Target and warehouse clubs such as Costco sell the common sizes, usually at lower prices but with fewer brands.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <h2 style={{ marginTop: 0 }}>Browse by make</h2>
          <div className="grid">
            {makes().map((m) => (
              <Link key={m.makeSlug} href={`/${m.makeSlug}/`} className="tile">
                <strong>{m.make}</strong>
                <span>{m.models.size} models</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 style={{ marginTop: 0 }}>How we check sizes</h2>
          <p className="lead">
            Fitment lists disagree more often than you would think, so we compare several of them. A size is marked verified only
            when two independent sources agree on both front blades. Until then, the page says it comes from one source.
          </p>
          <div className="facts">
            <div className="fact"><span>Model years listed</span><strong>{vehicles.length.toLocaleString("en-US")}</strong></div>
            <div className="fact"><span>Verified by two sources</span><strong>{s.verified.toLocaleString("en-US")}</strong></div>
            <div className="fact"><span>Makes</span><strong>{makes().length}</strong></div>
            <div className="fact"><span>Model years</span><strong>{first} to {latest}</strong></div>
          </div>
          <p><Link href="/methodology/">Read our method</Link></p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <h2 style={{ marginTop: 0 }}>Wiper blade guides</h2>
          <div className="grid">
            {guides.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}/`} className="tile">
                <Image className="tile-img" src={g.cover} alt="" width={1200} height={800} sizes="(max-width: 600px) 100vw, 360px" />
                <strong>{g.h1}</strong>
                <span>{g.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <h2 style={{ marginTop: 0 }}>Wiper size questions</h2>
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", name: SITE.name, url: SITE.url + "/" },
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
