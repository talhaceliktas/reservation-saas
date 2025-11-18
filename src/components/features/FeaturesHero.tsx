"use client";
import { useTranslations } from "next-intl";

export default function FeaturesHero() {
  const t = useTranslations("FeaturesPage.hero");

  return (
    <section className="relative pt-32 pb-20 bg-white overflow-hidden">
      {/* Arka Plan Izgarası (Modern Grid Pattern) */}
      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 mb-6">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
          {t("badge")}
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
          {t("title")}
        </h1>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          {t("desc")}
        </p>
      </div>
    </section>
  );
}
