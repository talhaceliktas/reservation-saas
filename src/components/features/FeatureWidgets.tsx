"use client";

import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import {
  MoreHorizontal,
  CreditCard as CardIcon,
  Wifi,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- 1. GELİR GRAFİĞİ (Recharts) ---
const chartData = [
  { name: "Pzt", value: 1200 },
  { name: "Sal", value: 2100 },
  { name: "Çar", value: 1800 },
  { name: "Per", value: 2400 },
  { name: "Cum", value: 3200 },
  { name: "Cmt", value: 4800 },
  { name: "Paz", value: 3800 },
];

export function RevenueWidget() {
  return (
    <div className="w-full h-full bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Aylık Gelir
          </p>
          <p className="text-2xl font-bold text-slate-900">₺24,500</p>
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
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
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

// --- 2. İNTERAKTİF TAKVİM ---
export function CalendarWidget() {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 w-[280px]">
      <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-2">
        <span className="font-bold text-slate-800">Kasım 2025</span>
        <MoreHorizontal size={16} className="text-slate-400" />
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-400 mb-2 font-medium">
        <span>Pt</span>
        <span>Sa</span>
        <span>Ça</span>
        <span>Pe</span>
        <span>Cu</span>
        <span>Ct</span>
        <span>Pa</span>
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

// --- 3. KREDİ KARTI ---
export function CreditCardWidget({ cardText }: { cardText: string }) {
  return (
    <div className="relative w-72 h-44 bg-slate-900 rounded-2xl p-6 text-white shadow-2xl overflow-hidden transform transition-transform group-hover:rotate-2 group-hover:scale-105 duration-500">
      {/* Background Shine */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-white/5 to-transparent"></div>

      <div className="flex justify-between items-start mb-8 relative z-10">
        <CardIcon className="w-8 h-8 opacity-90" />
        <Wifi className="w-6 h-6 opacity-60 rotate-90" />
      </div>

      <div className="space-y-1 mb-6 relative z-10">
        <div className="text-[10px] opacity-50 tracking-widest font-medium">
          {cardText.toUpperCase()}
        </div>
        <div className="text-lg font-mono tracking-widest text-slate-100 shadow-black drop-shadow-sm">
          4532 •••• •••• 8890
        </div>
      </div>

      <div className="flex justify-between items-end relative z-10">
        <div>
          <div className="text-[10px] opacity-50 font-medium">HOLDER</div>
          <div className="font-medium tracking-wide text-sm">
            TALHA CELIKTAS
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-[10px] opacity-50 font-medium">EXP</div>
          <div className="font-medium text-sm">12/28</div>
        </div>
      </div>
    </div>
  );
}
