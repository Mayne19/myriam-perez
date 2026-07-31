import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { PRIVACY_META, PRIVACY_SECTIONS } from "@/data/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité et responsabilité du client | Myriam Perez",
};

export default function PolitiqueDeConfidentialitePage() {
  return (
    <main>
      <LegalPage
        title={PRIVACY_META.title}
        subtitle={PRIVACY_META.subtitle}
        lastUpdated={PRIVACY_META.lastUpdated}
        sections={PRIVACY_SECTIONS}
      >
        <div className="rounded-2xl border border-espresso-900/[0.06] bg-white px-6 py-7 text-left md:px-7">
          <p className="text-lg leading-relaxed text-espresso-900">Merci de faire partie de notre communauté !</p>
          <p className="mt-2 text-base leading-relaxed text-espresso-600">Myriam Perez</p>
          <p className="text-base leading-relaxed text-espresso-600">Inspire &amp; Impact</p>
          <p className="text-base leading-relaxed text-espresso-600">Myriam Perez Inc</p>
        </div>
      </LegalPage>
    </main>
  );
}
