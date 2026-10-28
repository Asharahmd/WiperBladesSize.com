import Link from "next/link";
import { Figure } from "@/components/ui";

/** `cover` is a 1200x800 image in public/images, shown at the top, on the guide tiles and as the share image. */
export type Guide = { slug: string; title: string; h1: string; description: string; cover: string; coverAlt: string; body: React.ReactNode };

export const guides: Guide[] = [
  {
    slug: "how-to-measure-wiper-blades",
    cover: "/images/guides/measure/cover.webp",
    coverAlt: "Tape measure held along the rubber strip of a wiper blade",
    title: "How to Measure Wiper Blades (Driver, Passenger & Rear)",
    h1: "How to measure your wiper blades",
    description: "Measure the old blade with a tape measure, round to the nearest inch, and check the result against your car's listed sizes.",
    body: (
      <>
        <p>
          Wiper blades are sold by length in whole inches. The quickest way to confirm your size is to measure the blades already on
          the car, then compare the numbers with the sizes we list for your year, make and model.
        </p>
        <h2>What you need</h2>
        <p>A tape measure or a ruler marked in inches. A phone photo of each blade helps if you plan to shop later.</p>
        <h2>Measure each blade</h2>
        <ol className="steps">
          <li>Lift the driver-side arm away from the glass until it stays up on its own.</li>
          <li>Hold the tape along the rubber strip and measure from one end of the rubber to the other. Don&apos;t include the arm.</li>
          <li>Round to the nearest whole inch. A blade that reads 25¾&quot; is a 26&quot; blade.</li>
          <li>Do the same on the passenger side and on the rear wiper if your car has one.</li>
        </ol>
        <p>
          Measure both front blades. Most cars use a longer blade on the driver side, and swapping the two leaves a gap in the
          sweep where you look through the glass.
        </p>
        <h2>When the old blade is wrong</h2>
        <Figure src="/images/guides/measure/too-long.webp" alt="Wiper blade that is too long, hanging past the edge of the windshield" />
        <p>
          A previous owner may have fitted the wrong length. If your measurement doesn&apos;t match the size we list, look at how the
          blade sits when parked. A blade that overhangs the edge of the windshield or touches the other blade is too long. One that
          leaves a wide unwiped strip at the edge of the glass may be too short.
        </p>
        <h2>Can you go an inch shorter or longer?</h2>
        <p>
          An inch shorter fits and clears a little less glass. An inch longer can hit the windshield frame or the other blade, so
          only fit a longer blade if the manufacturer lists it for your car. When in doubt, buy the listed size.
        </p>
        <h2>Inches and millimeters</h2>
        <p>
          Packs sold in Europe and Asia often give the length in millimeters. One inch is 25.4 mm, so a 26&quot; blade is about
          660 mm, a 16&quot; blade about 405 mm and a 12&quot; rear blade about 305 mm. Packs often round these to 650, 400 and
          300 mm, which is the same blade.
        </p>
      </>
    ),
  },
  {
    slug: "how-to-change-wiper-blades",
    cover: "/images/guides/change/cover.webp",
    coverAlt: "Hands fitting a new wiper blade onto a raised wiper arm",
    title: "How to Change Wiper Blades: J-Hook, Push Button & Pinch Tab",
    h1: "How to change your wiper blades",
    description: "Step-by-step blade replacement for the common arm connectors, plus the mistakes that crack windshields.",
    body: (
      <>
        <p>
          Changing a wiper blade takes a few minutes and no tools. The steps depend on the connector, the joint where the blade meets
          the arm. Lift the arm and look at its tip. Our <Link href="/connectors/">connector guide</Link> shows how to tell the types
          apart.
        </p>
        <h2>Before you start</h2>
        <p>
          Lay a folded towel on the windshield under the arm. A bare arm is spring loaded, and if it snaps back onto the glass it can
          chip or crack it. Keep one hand on the arm while the blade is off.
        </p>
        <Figure src="/images/guides/change/towel.webp" alt="Folded towel on the windshield under a raised wiper arm" />
        <h2>J-hook arms</h2>
        <ol className="steps">
          <li>Lift the arm and turn the blade so it sits at a right angle to the arm.</li>
          <li>Press the small tab where the blade meets the hook, then push the blade down toward the glass to slide it out of the hook.</li>
          <li>Feed the hook through the gap in the new blade&apos;s adapter and pull the blade up into the hook until it clicks.</li>
          <li>Tug the blade gently to check it is locked, then lower the arm.</li>
        </ol>
        <div className="fig-pair">
          <Figure src="/images/guides/change/j-hook-out.webp" alt="Wiper blade turned at a right angle and slid out of a J-hook arm" />
          <Figure src="/images/guides/change/j-hook-in.webp" alt="New wiper blade being pulled up into a J-hook arm" />
        </div>
        <h2>Push button arms</h2>
        <ol className="steps">
          <li>Lift the arm and press the button on top of the blade&apos;s adapter.</li>
          <li>Slide the blade straight off the end of the arm.</li>
          <li>Slide the new blade on until the button pops up through its hole.</li>
        </ol>
        <Figure src="/images/guides/change/push-button.webp" alt="Thumb pressing the release button on a wiper blade adapter" />
        <h2>Pinch tab arms</h2>
        <ol className="steps">
          <li>Squeeze the two tabs on the adapter together.</li>
          <li>Lift the blade off the arm.</li>
          <li>Press the new blade onto the arm until both tabs click.</li>
        </ol>
        <Figure src="/images/guides/change/pinch-tab.webp" alt="Fingers squeezing the two tabs on a wiper blade adapter" />
        <h2>Rear wipers</h2>
        <p>
          Rear arms vary more than front ones. Some take a blade that clips on like a small J-hook, and others use a pin or a
          snap-on mount made for one car. See our <Link href="/guides/rear-wiper-blades/">rear wiper guide</Link> before you buy.
        </p>
        <h2>Test it</h2>
        <p>
          Spray washer fluid and run the wipers for a few sweeps. A blade that chatters or leaves streaks straight away is usually
          not fully seated or is mounted backwards on the adapter.
        </p>
      </>
    ),
  },
  {
    slug: "beam-vs-conventional-vs-hybrid",
    cover: "/images/guides/types/cover.webp",
    coverAlt: "Conventional, beam and hybrid wiper blades side by side",
    title: "Beam vs Conventional vs Hybrid Wiper Blades",
    h1: "Beam, conventional and hybrid wiper blades",
    description: "How the three blade designs differ, what each costs, and which one suits your windshield and climate.",
    body: (
      <>
        <p>
          All three designs come in the same lengths, so the size we list for your car works with any of them. They differ in how they
          press the rubber against the glass.
        </p>
        <h2>Conventional blades</h2>
        <p>
          A metal frame with several claws holds the rubber strip. They are the cheapest type and what many older cars left the
          factory with. On a strongly curved windshield the claws press harder at some points than others, which can leave streaks.
          In freezing weather, ice can pack into the open frame and stop the rubber from flexing.
        </p>
        <h2>Beam blades</h2>
        <p>
          A curved spring-steel band runs inside the blade, with no exterior frame. The band spreads pressure along the whole length,
          so it follows curved glass well. With no frame for snow to pack into, beam blades are the usual pick for cold climates.
          They cost more than conventional blades. Bosch ICON and Rain-X Latitude are beam blades.
        </p>
        <h2>Hybrid blades</h2>
        <p>
          A frame sits under an aerodynamic plastic shell. You get the even pressure of a frame with a cover that keeps out some snow
          and ice and helps the blade stay on the glass at highway speed. Many newer Japanese and Korean cars come with hybrid blades
          from the factory.
        </p>
        <h2 id="silicone">Silicone blades</h2>
        <p>
          Any of the three designs can use a silicone strip instead of natural rubber. Silicone holds up better in heat and sunlight,
          so it usually lasts longer, and some silicone blades leave a thin water-repellent layer on the glass. They cost more than
          rubber blades of the same type.
        </p>
        <h2>Which one to buy</h2>
        <p>
          On a modern car with curved glass, a beam or hybrid blade usually wipes cleaner. If you live where it snows, pick a beam
          blade or a winter blade with a rubber boot. Conventional blades are fine on flatter windshields and when price matters most.
          Whatever you buy, check that the pack includes the adapter for your <Link href="/connectors/">connector type</Link>.
        </p>
      </>
    ),
  },
  {
    slug: "how-often-to-replace-wiper-blades",
    cover: "/images/guides/replace/cover.webp",
    coverAlt: "Streaks left on a windshield by worn wiper blades",
    title: "How Often to Replace Wiper Blades (and the Signs It's Time)",
    h1: "How often to replace wiper blades",
    description: "Most makers suggest new blades every 6 to 12 months. Here are the signs that yours are worn out.",
    body: (
      <>
        <p>
          Blade makers generally suggest replacing wiper blades every 6 to 12 months. Rubber hardens in heat and sunlight and gets
          nicked by ice and grit, so blades wear out even on a car that sits most of the time.
        </p>
        <h2>Signs your blades are worn</h2>
        <ul>
          <li>Streaks or a thin film left behind after each sweep</li>
          <li>Chattering or skipping across the glass</li>
          <li>Squeaking on a wet windshield</li>
          <li>Rubber that is cracked, split, or peeling away from the frame</li>
          <li>A bent frame or a blade that no longer sits flat on the glass</li>
        </ul>
<Figure src="/images/guides/replace/cracked.webp" alt="Close-up of cracked, split rubber on a worn wiper blade" />
        <h2>Make blades last longer</h2>
        <p>
          Clear ice and snow with a scraper and the defroster before you run the wipers. Don&apos;t run them on a dry windshield. Wipe
          the rubber edge with a damp cloth when you fill up with fuel, and top up the washer fluid so the blades never drag on dry
          glass.
        </p>
        <h2>Change both fronts together</h2>
        <p>
          Both front blades wear at about the same rate. Replacing them as a pair keeps the sweep even. Check the rear blade at the
          same time: it runs less often but sits in the sun all year.
        </p>
      </>
    ),
  },
  {
    slug: "winter-wiper-blades",
    cover: "/images/guides/winter/cover.webp",
    coverAlt: "Wiper blade covered in ice and snow on a windshield",
    title: "Winter Wiper Blades: What to Buy for Snow and Ice",
    h1: "Wiper blades for snow and ice",
    description: "Why beam and winter blades work better in freezing weather, and habits that protect your blades all winter.",
    body: (
      <>
        <p>
          Snow and ice are hard on wiper blades. Ice packs into the joints of a framed blade, the rubber stiffens in the cold, and a
          blade frozen to the glass tears when the wipers start.
        </p>
        <h2>Which blades handle winter</h2>
        <p>
          Beam blades have no exposed frame, so there is less for ice to build up on. Winter blades go a step further: a framed blade
          wrapped in a rubber boot that keeps snow out of the joints. Winter blades are bulkier and some owners swap back to standard
          blades in spring. Both types come in the same lengths, so use the sizes we list for your car.
        </p>
<Figure src="/images/guides/winter/winter-blade.webp" alt="Winter wiper blade with a rubber boot over the frame" />
        <h2>Winter habits</h2>
        <ul>
          <li>Run the defroster until the blades come free. Never pull a frozen blade off the glass.</li>
          <li>Scrape the windshield before wiping. Wipers are not ice scrapers.</li>
          <li>Use a washer fluid rated for freezing temperatures. Summer fluid can freeze in the lines and on the glass.</li>
          <li>Knock packed snow and ice off the blades before you drive.</li>
        </ul>
        <h2>Should you lift the wipers before a storm?</h2>
        <p>
          Lifting the arms keeps the blades from freezing to the glass. Check your owner&apos;s manual first: on some cars the arms
          park under the hood line and can&apos;t be lifted until they are moved to a service position.
        </p>
      </>
    ),
  },
  {
    slug: "rear-wiper-blades",
    cover: "/images/guides/rear/cover.webp",
    coverAlt: "Rear wiper on the hatch window of an SUV",
    title: "Rear Wiper Blades: Sizes, Fit and What to Buy",
    h1: "Rear wiper blades",
    description: "Rear blades are shorter and use more car-specific mounts than front blades. How to get the right one.",
    body: (
      <>
        <p>
          SUVs, hatchbacks, wagons and minivans usually have a rear wiper. Rear blades are shorter than front blades, most often between
          10&quot; and 16&quot;, and they fit in more ways than front blades do.
        </p>
        <h2>Why rear blades are harder to match</h2>
        <p>
          Front arms mostly use a few standard connectors. Rear arms often use a mount made for one car or one maker, and some rear
          blades are molded into the arm, so the whole arm is replaced. A rear blade of the right length still has to fit your arm.
        </p>
<Figure src="/images/guides/rear/mount.webp" alt="Close-up of where a rear wiper blade attaches to its arm" />
        <h2>How to buy the right rear blade</h2>
        <ul>
          <li>Check the rear size on your car&apos;s page and measure the old blade to confirm it.</li>
          <li>Look at where the blade meets the arm and compare it with the photos on the pack.</li>
          <li>Buy a rear blade listed for your exact year, make and model, not just one of the right length.</li>
        </ul>
        <p>
          Few sources list rear sizes, so our pages say when a rear size comes from one source only. In that case measure the old
          blade before you buy. <Link href="/guides/how-to-measure-wiper-blades/">How to measure a wiper blade</Link>.
        </p>
      </>
    ),
  },
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
