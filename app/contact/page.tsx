import type { Metadata } from "next";
import TextPage from "@/components/TextPage";

export const metadata: Metadata = { title: "Contact", alternates: { canonical: "/contact/" } };

export default function Page() {
  return (
    <TextPage title="Contact">
      <p>
        Spotted a wrong size, or can&apos;t find your vehicle? Email{" "}
        <a href="mailto:hello@wiperbladessize.com">hello@wiperbladessize.com</a> with the year, make and model, and the blade
        length you measured if you have it.
      </p>
    </TextPage>
  );
}
