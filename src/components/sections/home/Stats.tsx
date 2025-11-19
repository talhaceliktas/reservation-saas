"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
  const t = useTranslations("Intro.stats");
  const containerRef = useRef(null);

  const stats = [
    { key: "availability", color: "text-blue-600" },
    { key: "efficiency", color: "text-purple-600" },
    { key: "setup", color: "text-emerald-600" },
    { key: "growth", color: "text-orange-600" },
  ];

  useGSAP(
    () => {
      const items = gsap.utils.toArray(".stat-item");

      gsap.fromTo(
        items,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1, // Sırayla gelsinler
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%", // Görünür olunca başla
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section className="w-full py-12 border-y border-slate-100 bg-white/50 backdrop-blur-sm">
      <div ref={containerRef} className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100/50">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-item flex flex-col items-center justify-center text-center space-y-2"
            >
              {/* Değer (Büyük Yazı) */}
              <span
                className={`text-4xl md:text-5xl font-black tracking-tight ${stat.color}`}
              >
                {t(`${stat.key}.value`)}
              </span>

              {/* Açıklama (Küçük Yazı) */}
              <span className="text-sm md:text-base font-medium text-slate-500 uppercase tracking-wide">
                {t(`${stat.key}.label`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
