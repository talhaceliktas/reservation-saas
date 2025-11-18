"use client";
import { useTranslations } from "next-intl";
import { BellRing, Check, Palette } from "lucide-react";
import CustomBranding from "./CustomBranding";

export default function DetailedSection() {
  const t = useTranslations("FeaturesPage.details");
  const tr = useTranslations("FeaturesPage.bento.notificationCard");

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* BÖLÜM 1: BİLDİRİMLER (Metin Sol, Görsel Sağ) */}
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
            <div className="relative w-[320px] h-[580px] bg-slate-900 rounded-[3rem] border-[10px] border-slate-900 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-20" />

              <div className="w-full h-full bg-gradient-to-b from-indigo-500 to-purple-600 pt-16 px-4 flex flex-col gap-3 relative">
                <p className="text-center text-white/60 text-xs font-medium mb-4 uppercase tracking-widest">
                  {tr("date")}
                </p>

                {/* Notification 1 */}
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm animate-in slide-in-from-bottom-4 fade-in duration-700">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center text-white text-[10px] font-bold">
                        B
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        {tr("notification1.app")}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {tr("notification1.date")}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">
                    {tr("notification1.title")}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {tr("notification1.message")}
                  </p>
                </div>

                {/* Notification 2 */}
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded-md flex items-center justify-center text-white">
                        <Check size={12} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        {tr("notification2.app")}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {tr("notification2.date")}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">
                    {tr("notification2.title")}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {tr("notification2.message")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BÖLÜM 2: ÖZELLEŞTİRME (Görsel Sol, Metin Sağ) */}
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
