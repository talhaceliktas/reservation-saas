import Link from "next/link";
import { Button } from "../../ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CTA({ locale }: { locale: string }) {
  const t = useTranslations("FeaturesPage.cta");
  return (
    <section className="py-32 bg-slate-900 text-center px-4 relative overflow-hidden">
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
