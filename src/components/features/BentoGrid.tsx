"use client";
import { useTranslations } from "next-intl";
import { Calendar, BarChart3, Smartphone, CreditCard } from "lucide-react";
import {
  RevenueWidget,
  CalendarWidget,
  CreditCardWidget,
} from "./FeatureWidgets";

export default function BentoGrid() {
  const t = useTranslations("FeaturesPage.bento");

  return (
    <section className="py-10 bg-white relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <div className="md:col-span-2 row-span-2 bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 overflow-hidden group hover:shadow-xl transition-shadow duration-500 flex flex-col justify-between h-[500px]">
            <div className="relative z-10 max-w-md">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-600/20">
                <Calendar size={24} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">
                {t("card1.title")}
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed">
                {t("card1.desc")}
              </p>
            </div>
            <div className="relative self-end mt-8 transform translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500">
              <CalendarWidget />
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white overflow-hidden relative group flex flex-col h-60 justify-between">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-1">{t("card2.title")}</h3>
                <p className="text-slate-400 text-sm">{t("card2.desc")}</p>
              </div>
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <CreditCard size={20} />
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 transform scale-90 rotate-[-10deg] group-hover:rotate-0 group-hover:scale-100 transition-all duration-500">
              <CreditCardWidget cardText={t("card2.cardText")} />
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 group hover:border-emerald-100 transition-colors h-60 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {t("card3.title")}
                </h3>
                <p className="text-slate-500 text-sm">{t("card3.desc")}</p>
              </div>
              <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                <BarChart3 size={20} />
              </div>
            </div>
            <div className="mt-4 flex-1">
              <RevenueWidget />
            </div>
          </div>

          <div className="md:col-span-3 bg-linear-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-12 h-auto md:h-[350px]">
            <div className="flex-1 text-left z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm font-medium mb-6 backdrop-blur-md border border-white/10">
                <Smartphone size={16} /> Mobile First
              </div>
              <h3 className="text-3xl font-bold mb-4">{t("card4.title")}</h3>
              <p className="text-blue-100 text-lg max-w-lg leading-relaxed">
                {t("card4.desc")}
              </p>
            </div>

            <div className="relative z-10 w-72 h-full shrink-0 transform translate-y-10 group-hover:translate-y-6 transition-transform duration-500">
              <div className="w-full h-[400px] bg-slate-900 rounded-t-[2.5rem] border-8 border-slate-900 shadow-2xl overflow-hidden">
                <div className="w-full h-full bg-white relative">
                  <div className="bg-slate-50 p-4 h-full space-y-3">
                    <div className="h-8 w-full bg-slate-200 rounded-lg animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-24 w-1/2 bg-blue-100 rounded-xl" />
                      <div className="h-24 w-1/2 bg-indigo-100 rounded-xl" />
                    </div>
                    <div className="h-32 w-full bg-slate-100 rounded-xl mt-4" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 rounded-b-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
