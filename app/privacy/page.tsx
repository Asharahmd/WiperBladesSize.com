import type { Metadata } from "next";
import TextPage from "@/components/TextPage";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy/" } };

export default function Page() {
  return (
    <TextPage title="Privacy policy">
      <p>
        This site has no accounts and doesn&apos;t ask for personal information. The vehicle finder runs in your browser and the
        car you pick isn&apos;t stored.
      </p>
      <p>
        Retailers we link to, such as Amazon, set their own cookies when you visit them, and their privacy policies apply there. If
        we add analytics or advertising, this page will list the providers and the cookies they use.
      </p>
    </TextPage>
  );
}
