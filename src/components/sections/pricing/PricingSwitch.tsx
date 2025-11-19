"use client";

import { cn } from "@/lib/utils";
import { CalendarDays, CalendarRange } from "lucide-react";

interface PricingSwitchProps {
  isYearly: boolean;
  onToggle: (val: boolean) => void;
  labels: {
    monthly: string;
    yearly: string;
    save: string;
  };
}

export default function PricingSwitch({
  isYearly,
  onToggle,
  labels,
}: PricingSwitchProps) {
  return (
    <div className="flex justify-center mb-12">
      {/* Kapsayıcı: Arkaplan rengi ve border */}
      <div className="relative bg-muted/50 p-1 rounded-xl border border-border/50 inline-flex w-full max-w-[340px]">
        {/* Kayan Arkaplan (Motion) */}
        <div
          className={cn(
            "absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-background rounded-lg shadow-sm border border-border/50 transition-transform duration-300 ease-out z-0",
            isYearly ? "translate-x-full" : "translate-x-0"
          )}
        />

        {/* Butonlar Grid */}
        <div className="relative z-10 grid grid-cols-2 w-full">
          {/* Aylık Buton */}
          <button
            onClick={() => onToggle(false)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors duration-200",
              !isYearly
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/70"
            )}
          >
            <CalendarDays size={16} />
            {labels.monthly}
          </button>

          {/* Yıllık Buton */}
          <button
            onClick={() => onToggle(true)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors duration-200",
              isYearly
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/70"
            )}
          >
            <CalendarRange size={16} />
            {labels.yearly}
            {/* İndirim Badge'i (Absolute ile sağ üst köşeye asabiliriz veya yanında tutabiliriz) */}
            <span className="ml-1.5 text-[10px] font-bold bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded border border-green-500/20 whitespace-nowrap">
              {labels.save}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
