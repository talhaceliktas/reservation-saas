"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const themes = [
  {
    id: "blue",
    gradient: "from-blue-500 to-indigo-600",
    solid: "bg-blue-600",
    ring: "ring-blue-600",
  },
  {
    id: "purple",
    gradient: "from-purple-500 to-pink-500",
    solid: "bg-purple-600",
    ring: "ring-purple-600",
  },
  {
    id: "green",
    gradient: "from-emerald-400 to-teal-600",
    solid: "bg-emerald-500",
    ring: "ring-emerald-500",
  },
  {
    id: "orange",
    gradient: "from-orange-400 to-red-500",
    solid: "bg-orange-500",
    ring: "ring-orange-500",
  },
];

export default function CustomBranding() {
  const t = useTranslations("FeaturesPage.details");

  // Varsayılan olarak ilk rengi seçiyoruz
  const [activeTheme, setActiveTheme] = useState(themes[0]);

  return (
    <div className="flex-1 w-full bg-slate-50 rounded-[3rem] p-8 lg:p-12 border border-slate-100">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all hover:shadow-2xl duration-500">
        {/* 1. Dinamik Header Alanı (Gradient Burada Değişiyor) */}
        <div
          className={cn(
            "h-40 bg-linear-to-r relative transition-all duration-700 ease-in-out",
            activeTheme.gradient
          )}
        >
          {/* Logo Alanı */}
          <div className="absolute -bottom-10 left-8 w-20 h-20 bg-white rounded-2xl p-1 shadow-md">
            <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400 font-bold">
              LOGO
            </div>
          </div>
        </div>

        <div className="pt-12 px-8 pb-8 space-y-6">
          <div className="flex gap-3">
            <div className="h-3 w-24 bg-slate-200 rounded-full" />
            <div
              className={cn(
                "h-3 w-12 rounded-full opacity-30 transition-colors duration-500",
                activeTheme.solid
              )}
            />
          </div>
          <div className="space-y-3">
            <div className="h-2 w-full bg-slate-100 rounded-full" />
            <div className="h-2 w-3/4 bg-slate-100 rounded-full" />
          </div>

          <div className="flex gap-2 pt-2">
            <div
              className={cn(
                "h-10 flex-1 rounded-lg transition-colors duration-500 opacity-90",
                activeTheme.solid
              )}
            />
            <div className="h-10 w-10 border border-slate-100 rounded-lg" />
          </div>

          <div className="pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">
              {t("customization.tag")} {/* veya 'Tema Rengi' yazabilirsin */}
            </p>
            <div className="flex gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    theme.solid,
                    activeTheme.id === theme.id
                      ? `ring-2 ring-offset-2 ${theme.ring} scale-110`
                      : "hover:scale-110 opacity-70 hover:opacity-100"
                  )}
                  aria-label={`Select ${theme.id} theme`}
                >
                  {activeTheme.id === theme.id && (
                    <Check
                      size={14}
                      className="text-white animate-in zoom-in duration-300"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
