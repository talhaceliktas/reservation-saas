"use client";

import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useTranslations } from "next-intl";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
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

  // Veri hazırlığı
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
