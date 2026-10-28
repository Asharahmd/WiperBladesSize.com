import type { Metadata } from "next";
import Link from "next/link";
import TextPage from "@/components/TextPage";

export const metadata: Metadata = { title: "About", alternates: { canonical: "/about/" } };

export default function Page() {
  return (
    <TextPage title="About WiperBladesSize">
      <p>
        WiperBladesSize answers one question: which wiper blades fit your car. Pick a year, make and model and you get the driver,
        passenger and rear lengths, the connector type, and blades that fit.
      </p>
      <p>
        Retailer lookup tools give you one brand&apos;s part numbers. We list the plain sizes, so you can buy any brand, and we
        show where each size came from. Read <Link href="/methodology/">how we check sizes</Link> for the details.
      </p>
    </TextPage>
  );
}
