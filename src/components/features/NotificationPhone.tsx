"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

export function NotificationPhone() {
  const t = useTranslations("FeaturesPage.bento.notificationCard");

  return (
    <div className="relative w-[320px] h-[580px] bg-slate-900 rounded-[3rem] border-10 border-slate-900 shadow-2xl overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-20" />

      <div className="w-full h-full bg-linear-to-b from-indigo-500 to-purple-600 pt-16 px-4 flex flex-col gap-3 relative">
        <p className="text-center text-white/60 text-xs font-medium mb-4 uppercase tracking-widest">
          {t("date")}
        </p>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm animate-in slide-in-from-bottom-4 fade-in duration-700">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center text-white text-[10px] font-bold">
                B
              </div>
              <span className="text-xs font-semibold text-slate-700">
                {t("notification1.app")}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              {t("notification1.date")}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-900">
            {t("notification1.title")}
          </p>
          <p className="text-xs text-slate-600 mt-0.5">
            {t("notification1.message")}
          </p>
        </div>

        {/* Notification 2 (Delayed) */}
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-md flex items-center justify-center text-white">
                <Check size={12} />
              </div>
              <span className="text-xs font-semibold text-slate-700">
                {t("notification2.app")}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              {t("notification2.date")}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-900">
            {t("notification2.title")}
          </p>
          <p className="text-xs text-slate-600 mt-0.5">
            {t("notification2.message")}
          </p>
        </div>
      </div>
    </div>
  );
}
