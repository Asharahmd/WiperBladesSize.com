import type { Metadata } from "next";
import TextPage from "@/components/TextPage";

export const metadata: Metadata = { title: "Affiliate Disclosure", alternates: { canonical: "/affiliate-disclosure/" } };

export default function Page() {
  return (
    <TextPage title="Affiliate disclosure">
      <p>
        Some links on this site go to retailers such as Amazon. As an Amazon Associate we earn from qualifying purchases. The
        price you pay is the same.
      </p>
      <p>Commissions never change the sizes we publish. Sizes come from fitment data and are listed the same way for every brand.</p>
    </TextPage>
  );
}
