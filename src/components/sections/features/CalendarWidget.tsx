"use client";

import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function CalendarWidget() {
  const t = useTranslations("FeaturesPage.bento.dateCard");

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 w-[280px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-2">
        <span className="font-bold text-slate-800">{t("date")}</span>
        <MoreHorizontal size={16} className="text-slate-400" />
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-400 mb-2 font-medium">
        {days.map((dayKey) => (
          <span key={dayKey}>{t(`weekDays.${dayKey}`)}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
          <div
            key={day}
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center text-sm cursor-default transition-all",
              day === 14
                ? "bg-blue-600 text-white shadow-md scale-110 font-semibold"
                : "text-slate-600 hover:bg-slate-50",
              [3, 8, 22].includes(day) &&
                day !== 14 &&
                "bg-blue-50 text-blue-600 font-medium"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="mt-4 bg-slate-50 p-3 rounded-xl flex items-center gap-3">
        <div className="h-10 w-1 bg-blue-500 rounded-full"></div>
        <div>
          <p className="text-xs text-slate-500 font-medium">14:00 - 15:00</p>
          <p className="text-sm font-bold text-slate-900">Saç Kesimi (Ahmet)</p>
        </div>
      </div>
    </div>
  );
}
