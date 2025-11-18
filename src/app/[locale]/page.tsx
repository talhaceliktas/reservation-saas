"use client";

import { useTranslations } from "next-intl";
import { Button } from "../../components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function HomePage() {
  const t = useTranslations("HomePage.hero");

  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".hero-badge", {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      })
        .from(".hero-title", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
        })
        .from(
          ".hero-desc",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.4"
        )
        .from(
          ".hero-btns",
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.2"
        );
    },
    { scope: containerRef }
  );

  return (
    <main
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-slate-50 to-slate-100 px-4 text-center overflow-hidden"
    >
      {/* Arka Plan Süslemesi (Blurry Blobs) */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="hero-badge inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm">
          {t("badge")}
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900">
          <span className="hero-title block">{t("title")}</span>{" "}
          <span className="hero-title block bg-linear-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            {t("titleHighlight")}
          </span>
        </h1>

        <p className="hero-desc text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
          {t("description")}
        </p>

        <div className="hero-btns flex flex-col sm:flex-row gap-4 mt-4">
          <Button
            size="lg"
            className="text-lg h-12 px-8 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
          >
            {t("primaryButton")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="text-lg h-12 px-8 border-slate-300 hover:bg-slate-50"
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            {t("secondaryButton")}
          </Button>
        </div>
      </div>
    </main>
  );
}
