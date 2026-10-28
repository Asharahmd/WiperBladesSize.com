import type { Metadata } from "next";
import Link from "next/link";
import TextPage from "@/components/TextPage";

export const metadata: Metadata = {
  title: "How We Check Wiper Blade Sizes",
  description: "Where our wiper blade sizes come from and when we mark a size as verified.",
  alternates: { canonical: "/methodology/" },
};

export default function Page() {
  return (
    <TextPage title="How we check wiper blade sizes">
      <p>
        Wiper size lists disagree more often than you would expect. One catalog lists a 16 inch passenger blade for a car while
        another lists 18 inches, usually because a mid-year change or a different body style got mixed in. So we don&apos;t trust
        any single list.
      </p>
      <h2>Two sources before a size counts as verified</h2>
      <p>
        Each vehicle starts with sizes from a blade maker&apos;s fitment data. We then compare them with a second, independent
        source: a UK specialist retailer&apos;s fitment list for models sold there, a European wiper maker&apos;s fitment
        catalog, US size tables, or a second US fitment database that we check by hand, model by model. When two sources agree
        on the driver and passenger blades, the page says <strong>verified</strong>. Until then it says how many sources we have
        checked, and the page is kept out of search results.
      </p>
      <p>
        Rear blades are harder, because few sources list them. When only one source gives the rear size, the page says so, and
        you should check the old rear blade before you buy.
      </p>
      <h2>When sources disagree</h2>
      <p>
        We publish the size that two sources agree on, even when a third source says something else. If no two sources agree,
        the page stays unverified and out of search results until we can settle it. If a model year really does take two
        lengths, for example a sedan and a coupe, the page lists both and tells you to measure your old blade.
      </p>
      <h2>Found a wrong size?</h2>
      <p>
        Tell us through the <Link href="/contact/">contact page</Link> with your year, make, model and the size you measured. We
        correct confirmed errors.
      </p>
    </TextPage>
  );
}
