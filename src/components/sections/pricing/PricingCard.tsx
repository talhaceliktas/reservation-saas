import { Check, Minus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingPlan, FeatureConfig } from "./types";
import { useTranslations } from "next-intl";

interface PricingCardProps {
  plan: PricingPlan;
  isYearly: boolean;
  features: FeatureConfig[];
}

export default function PricingCard({
  plan,
  isYearly,
  features,
}: PricingCardProps) {
  const t = useTranslations("Pricing"); // Hook'u buraya da alabiliriz veya prop geçebiliriz.
  // Component içinde çağırmak daha temizdir.

  const price = isYearly ? plan.price_yearly : plan.price_monthly;
  const period = t("intervals.month"); // Veya isYearly ? 'year' : 'month'

  return (
    <div
      className={cn(
        "relative group flex flex-col h-full bg-background border transition-all duration-300",
        plan.popular
          ? "shadow-2xl shadow-blue-500/10 md:-mt-4 md:mb-4 z-10 border-blue-500/30"
          : "border-border/60 hover:border-border",
        "rounded-2xl overflow-hidden"
      )}
    >
      <div
        className={cn("p-1.5", plan.popular ? "bg-blue-500/5" : "bg-muted/30")}
      >
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-background border border-border/50 shadow-sm">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                plan.accentColor
              )}
            />
            <span className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground/80">
              {plan.time_slot}
            </span>
          </div>
          {plan.popular && (
            <div className="flex items-center gap-1 text-[9px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
              <Sparkles size={10} /> {t("labels.popular")}
            </div>
          )}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        {/* İsim & Açıklama */}
        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
          {plan.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-6 pb-6 border-b border-dashed border-border">
          {plan.description}
        </p>

        {/* Özellikler Listesi */}
        <ul className="space-y-3 mb-8 flex-1">
          {features.map((feature) => {
            // any casting: Tip güvenliği için map objesi kullanmak daha iyi ama hızlı çözüm için bu uygun
            const rawValue = feature[plan.id as keyof FeatureConfig];
            const hasFeature = !!rawValue;

            // Değer bir string ise (örn: "features.values.2_staff") onu çevir
            // Değilse (boolean true) sadece boş string
            const displayValue =
              typeof rawValue === "string" ? t(rawValue) : "";

            return (
              <li key={feature.key} className="flex items-start gap-3 text-sm">
                <div
                  className={cn(
                    "mt-0.5 min-w-4 h-4 rounded flex items-center justify-center border",
                    hasFeature
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent border-muted-foreground/30 text-muted-foreground/30"
                  )}
                >
                  {hasFeature ? (
                    <Check size={10} strokeWidth={4} />
                  ) : (
                    <Minus size={10} />
                  )}
                </div>
                <span
                  className={cn(
                    hasFeature ? "text-foreground" : "text-muted-foreground/50"
                  )}
                >
                  {t(`features.keys.${feature.key}`)}
                  {displayValue && (
                    <span className="font-semibold ml-1 text-foreground/80">
                      ({displayValue})
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Fiyat Alanı */}
        <div className="bg-muted/20 -mx-8 -mb-8 p-8 border-t border-border mt-auto group-hover:bg-muted/40 transition-colors">
          <div className="flex justify-between items-end mb-4">
            <span className="text-sm text-muted-foreground font-medium">
              {t("labels.total_amount")}
            </span>
            <div className="text-right">
              <div className="text-3xl font-bold font-mono tracking-tight text-foreground">
                {price === "Özel" || price === "Special" ? "" : "₺"}
                {price}
              </div>
              {price !== "Özel" && price !== "Special" && (
                <span className="text-[10px] uppercase text-muted-foreground font-medium">
                  /{isYearly ? t("intervals.year") : t("intervals.month")}{" "}
                  {t("intervals.vat")}
                </span>
              )}
            </div>
          </div>

          <button
            className={cn(
              "w-full py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-[0.98]",
              plan.popular
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                : "bg-background border border-border text-foreground hover:bg-accent"
            )}
          >
            {plan.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
