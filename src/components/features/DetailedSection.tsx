"use client";
import { useTranslations } from "next-intl";
import { BellRing, Check, Palette } from "lucide-react";

export default function DetailedSection() {
  const t = useTranslations("FeaturesPage.details");

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
              {["SMS", "Email", "WhatsApp", "Push"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Phone UI Simulation */}
          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <div className="relative w-[320px] h-[580px] bg-slate-900 rounded-[3rem] border-[10px] border-slate-900 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-20" />

              {/* Wallpaper & Notifications */}
              <div className="w-full h-full bg-gradient-to-b from-indigo-500 to-purple-600 pt-16 px-4 flex flex-col gap-3 relative">
                <p className="text-center text-white/60 text-xs font-medium mb-4 uppercase tracking-widest">
                  Tuesday, 12 September
                </p>

                {/* Notification 1 */}
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm animate-in slide-in-from-bottom-4 fade-in duration-700">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center text-white text-[10px] font-bold">
                        B
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        BookIt
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">Şimdi</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">
                    Randevu Hatırlatması 📅
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Yarın 14:00&apos;da Ahmet Bey ile randevunuz var.
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
                        Banka
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">2d önce</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">
                    Ödeme Alındı 💰
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Hesabınıza 450,00 TL giriş oldu.
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

          {/* UI Customizer Visual */}
          <div className="flex-1 w-full bg-slate-50 rounded-[3rem] p-8 lg:p-12 border border-slate-100">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-pink-500 to-orange-500 relative">
                <div className="absolute -bottom-10 left-8 w-20 h-20 bg-white rounded-2xl p-1 shadow-md">
                  <div className="w-full h-full bg-slate-100 rounded-xl" />
                </div>
              </div>
              <div className="pt-12 px-8 pb-8 space-y-6">
                <div className="flex gap-3">
                  <div className="h-3 w-24 bg-slate-200 rounded-full" />
                  <div className="h-3 w-12 bg-blue-100 rounded-full" />
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-slate-100 rounded-full" />
                  <div className="h-2 w-3/4 bg-slate-100 rounded-full" />
                </div>

                {/* Color Picker Simulation */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-3">
                    Tema Rengi
                  </p>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 ring-2 ring-offset-2 ring-blue-600 cursor-pointer" />
                    <div className="w-8 h-8 rounded-full bg-purple-600 cursor-pointer hover:scale-110 transition-transform" />
                    <div className="w-8 h-8 rounded-full bg-emerald-500 cursor-pointer hover:scale-110 transition-transform" />
                    <div className="w-8 h-8 rounded-full bg-orange-500 cursor-pointer hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
