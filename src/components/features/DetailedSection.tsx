"use client";

import { useTranslations } from "next-intl";
import { BellRing, Palette } from "lucide-react";
import CustomBranding from "./CustomBranding"; // Mevcut dosyan
import { NotificationPhone } from "./NotificationPhone"; // Yeni ayırdığımız dosya

export default function DetailedSection() {
  const t = useTranslations("FeaturesPage.details");

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600">
              <BellRing size={24} />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 leading-tight">
              {t("notifications.title")}
            </h2>
            <p className="text-xl text-slate-500 leading-relaxed">
              {t("notifications.desc")}
            </p>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-3">
              {["SMS", "Email", "WhatsApp"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <NotificationPhone />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-600">
              <Palette size={24} />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 leading-tight">
              {t("customization.title")}
            </h2>
            <p className="text-xl text-slate-500 leading-relaxed">
              {t("customization.desc")}
            </p>
          </div>

          <CustomBranding />
        </div>
      </div>
    </section>
  );
}
