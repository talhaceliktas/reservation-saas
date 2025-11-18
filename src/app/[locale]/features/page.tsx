import { setRequestLocale } from "next-intl/server";
import FeaturesHero from "@/components/features/FeaturesHero";
import BentoGrid from "@/components/features/BentoGrid";
import DetailedSection from "@/components/features/DetailedSection";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FeaturesPage({ params }: Props) {
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

function CTA({ locale }: { locale: string }) {
  const t = useTranslations("FeaturesPage.cta");
  return (
    <section className="py-32 bg-slate-900 text-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
          {t("title")}
        </h2>
        <Link href={`/${locale}/login`}>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-500 text-white text-lg px-10 h-14 rounded-full shadow-xl shadow-blue-900/50 transition-all hover:scale-105"
          >
            {t("btn")} <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
