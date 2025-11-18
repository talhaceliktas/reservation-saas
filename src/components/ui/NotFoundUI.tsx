// src/components/sections/NotFoundUI.tsx
"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, MoveLeft } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function NotFoundUI() {
  const t = useTranslations("NotFound");
  const router = useRouter();
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".error-code", {
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      })
        .from(".error-title", { y: 20, opacity: 0, duration: 0.5 }, "-=0.4")
        .from(".error-desc", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
        .from(".error-btns", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3");
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative overflow-hidden bg-slate-50"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl -z-10" />

      <h1 className="error-code text-[150px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-slate-200 to-slate-100 select-none">
        {t("code")}
      </h1>

      <div className="relative z-10 -mt-10 space-y-6 max-w-lg mx-auto">
        <h2 className="error-title text-3xl md:text-4xl font-bold text-slate-900">
          {t("title")}
        </h2>
        <p className="error-desc text-slate-500 text-lg">{t("desc")}</p>
        <div className="error-btns flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="w-full sm:w-auto gap-2"
          >
            <MoveLeft size={18} />
            {t("buttons.back")}
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 gap-2 shadow-lg shadow-blue-600/20"
            >
              <Home size={18} />
              {t("buttons.home")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
