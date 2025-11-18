"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Calendar, MessageSquare, CreditCard, LucideIcon } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FeatureItem = {
  icon: LucideIcon;
  key: "calendar" | "reminder" | "payment";
  color: string;
  bgGradient: string;
};

export default function Features() {
  const t = useTranslations("HomePage.features");
  const containerRef = useRef<HTMLDivElement>(null);

  const features: FeatureItem[] = [
    {
      icon: Calendar,
      key: "calendar",
      color: "text-blue-600",
      bgGradient: "from-blue-500/20 to-blue-500/5",
    },
    {
      icon: MessageSquare,
      key: "reminder",
      color: "text-violet-600",
      bgGradient: "from-violet-500/20 to-violet-500/5",
    },
    {
      icon: CreditCard,
      key: "payment",
      color: "text-emerald-600",
      bgGradient: "from-emerald-500/20 to-emerald-500/5",
    },
  ];

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".feature-card");

      gsap.fromTo(
        cards,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="features"
      className="py-24 bg-slate-50 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-image-gradient-to-b" />

      <div ref={containerRef} className="container relative mx-auto px-4 z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
            {t("why")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-2 cursor-default overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-linear-to-br ${feature.bgGradient} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div
                className={`mb-6 p-4 rounded-2xl w-fit bg-slate-50 group-hover:scale-110 transition-transform duration-300 ${feature.color} bg-opacity-10`}
              >
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>

              {/* İçerik */}
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {t(`cards.${feature.key}.title`)}
              </h3>
              <p className="text-slate-500 leading-relaxed">
                {t(`cards.${feature.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
