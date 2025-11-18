"use client";

import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { MoreHorizontal, CreditCard as CardIcon, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ChartDataItem {
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: ChartDataItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-lg min-w-[100px]">
        <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
        <p className="text-emerald-600 text-lg font-bold">
          ${payload[0].value.toLocaleString()}.0
        </p>
      </div>
    );
  }
  return null;
};

export function RevenueWidget() {
  const t = useTranslations("FeaturesPage.bento.dateCard");

  const weekDaysObj = t.raw("weekDays") as Record<string, string>;
  const weekOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekDaysArray = weekOrder.map((day) => weekDaysObj[day]);

  const values = [383, 452, 332, 731, 635, 669, 932];
  const chartData = weekDaysArray.map((day, idx) => ({
    name: day,
    value: values[idx],
  }));

  return (
    <div className="w-full h-full bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            {t("monthlyIncome")}
          </p>
          <p className="text-2xl font-bold text-slate-900">$6.572</p>
        </div>
        <span className="bg-emerald-50 text-emerald-600 text-xs font-medium px-2 py-1 rounded-full">
          +18%
        </span>
      </div>
      <div className="h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#colorGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CalendarWidget() {
  const t = useTranslations("FeaturesPage.bento.dateCard");

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 w-[280px]">
      <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-2">
        <span className="font-bold text-slate-800">{t("date")}</span>
        <MoreHorizontal size={16} className="text-slate-400" />
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-400 mb-2 font-medium">
        <span>{t("weekDays.Mon")}</span>
        <span>{t("weekDays.Tue")}</span>
        <span>{t("weekDays.Wed")}</span>
        <span>{t("weekDays.Thu")}</span>
        <span>{t("weekDays.Fri")}</span>
        <span>{t("weekDays.Sat")}</span>
        <span>{t("weekDays.Sun")}</span>
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

export function CreditCardWidget({ cardText }: { cardText: string }) {
  return (
    <div className="relative w-72 h-44 bg-slate-900 rounded-2xl p-6 text-white shadow-2xl overflow-hidden transform transition-transform group-hover:rotate-2 group-hover:scale-105 duration-500 ">
      {/* Background Shine */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-tr from-white/5 to-transparent"></div>

      <div className="flex justify-between items-start mb-8 relative z-10">
        <CardIcon className="w-8 h-8 opacity-90" />
        <Wifi className="w-6 h-6 opacity-60 rotate-90" />
      </div>

      <div className="space-y-1 mb-2 relative z-10">
        <div className="text-[10px] opacity-50 tracking-widest font-medium">
          {cardText.toUpperCase()}
        </div>
        <div className="text-lg font-mono tracking-widest text-slate-100 drop-shadow-sm">
          4532 •••• •••• 8890
        </div>
      </div>

      <div className="text-lg font-mono  text-slate-100 drop-shadow-sm">
        John Doe
      </div>
    </div>
  );
}
