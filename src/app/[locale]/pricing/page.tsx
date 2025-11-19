"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import PricingSwitch from "@/components/sections/pricing/PricingSwitch";
import PricingCard from "@/components/sections/pricing/PricingCard";
import {
  FeatureConfig,
  PricingPlan,
} from "@/components/sections/pricing/types";

const featuresList: FeatureConfig[] = [
  { key: "appointments", starter: true, pro: true, enterprise: true },
  {
    key: "staff",
    starter: "features.values.2_staff",
    pro: "features.values.10_staff",
    enterprise: "features.values.unlimited",
  },
  { key: "sms", starter: false, pro: true, enterprise: true },
  { key: "analytics", starter: false, pro: true, enterprise: true },
  { key: "api", starter: false, pro: false, enterprise: true },
  {
    key: "support",
    starter: "features.values.email",
    pro: "features.values.live",
    enterprise: "features.values.dedicated",
  },
];

export default function PricingSection() {
  const t = useTranslations("Pricing");
  const [isYearly, setIsYearly] = useState(false);

  const plans: PricingPlan[] = [
    {
      id: "starter",
      name: t("plans.starter.name"),
      description: t("plans.starter.description"),
      time_slot: t("plans.starter.time_slot"),
      price_monthly: t("plans.starter.price_monthly"),
      price_yearly: t("plans.starter.price_yearly"),
      cta: t("plans.starter.cta"),
      popular: false,
      accentColor: "bg-slate-400",
    },
    {
      id: "pro",
      name: t("plans.pro.name"),
      description: t("plans.pro.description"),
      time_slot: t("plans.pro.time_slot"),
      price_monthly: t("plans.pro.price_monthly"),
      price_yearly: t("plans.pro.price_yearly"),
      cta: t("plans.pro.cta"),
      popular: true,
      accentColor: "bg-blue-500",
    },
    {
      id: "enterprise",
      name: t("plans.enterprise.name"),
      description: t("plans.enterprise.description"),
      time_slot: t("plans.enterprise.time_slot"),
      price_monthly: t("plans.enterprise.price_monthly"),
      price_yearly: t("plans.enterprise.price_yearly"),
      cta: t("plans.enterprise.cta"),
      popular: false,
      accentColor: "bg-violet-500",
    },
  ];

  return (
    <section
      className="py-24 relative overflow-hidden bg-background"
      id="pricing"
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
        </div>

        <PricingSwitch
          isYearly={isYearly}
          onToggle={setIsYearly}
          labels={{
            monthly: t("switch.monthly"),
            yearly: t("switch.yearly"),
            save: t("switch.save_badge"),
          }}
        />

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
          {plans.map((plan) => (
            <PricingCard // <-- Burası PricingSwitch DEĞİL, PricingCard olmalı
              key={plan.id}
              plan={plan}
              isYearly={isYearly}
              features={featuresList}
            />
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            {t("labels.footer_text")}{" "}
            <a
              href="#"
              className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
            >
              {t("labels.sales_link")}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
