import { setRequestLocale } from "next-intl/server";
import FeaturesHero from "@/components/sections/features/FeaturesHero";
import BentoGrid from "@/components/sections/features/BentoGrid";
import DetailedSection from "@/components/sections/features/DetailedSection";
import CTA from "@/components/sections/features/CTA";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-white">
      <FeaturesHero />
      <BentoGrid />
      <DetailedSection />
      <CTA locale={locale} />
    </main>
  );
}
