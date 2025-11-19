"use client";

import { useTranslations } from "next-intl";
import { Target, Heart, Quote, Layers } from "lucide-react";

export default function AboutSection() {
  const t = useTranslations("About");

  return (
    <section
      className="py-24 relative bg-background overflow-hidden pt-40"
      id="about"
    >
      {/* Arkaplan: Çok hafif nokta deseni (Sadelik için) */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* 1. Başlık Bloğu */}
        <div className="max-w-3xl mb-20">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6 border border-primary/20">
            <Layers size={12} />
            {t("badge")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            {t("title")}
          </h2>
          <p className="text-xl text-muted-foreground font-light leading-relaxed border-l-4 border-primary/20 pl-6">
            {t("subtitle")}
          </p>
        </div>

        {/* 2. Grid Yapısı (Hikaye ve Misyon) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Sol Taraf: Hikaye Metni (Editorial Style) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="prose prose-lg dark:prose-invert">
              <h3 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Quote className="text-primary/40 rotate-180" size={24} />
                {t("story.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("story.p1")}
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                {t("story.p2")}
              </p>
            </div>

            {/* İstatistikler (Statik Placeholder) */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50">
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  100+
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  {t("stats.users")}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  50k+
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  {t("stats.bookings")}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  %99.9
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  {t("stats.uptime")}
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf: Kartlar (Misyon & Vizyon) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Misyon Kartı */}
            <div className="group bg-card border border-border/50 p-8 rounded-3xl transition-all duration-300 hover:shadow-lg hover:border-primary/20">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target size={24} />
              </div>
              <h4 className="text-xl font-bold mb-3 text-foreground">
                {t("mission.title")}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("mission.description")}
              </p>
            </div>

            {/* Vizyon Kartı */}
            <div className="group bg-card border border-border/50 p-8 rounded-3xl transition-all duration-300 hover:shadow-lg hover:border-primary/20">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart size={24} />
              </div>
              <h4 className="text-xl font-bold mb-3 text-foreground">
                {t("vision.title")}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("vision.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
