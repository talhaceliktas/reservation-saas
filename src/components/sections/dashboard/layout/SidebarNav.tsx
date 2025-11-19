"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { sidebarItems } from "./SidebarItems"; // Veri dosyanın yolu

export default function SidebarNav({ locale }: { locale: string }) {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sidebar-item",
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          delay: 0.2,
          clearProps: "all",
        }
      );
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={navRef} className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
      {sidebarItems.map((group) => (
        <div key={group.group}>
          <h3 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t(`groups.${group.group.toLowerCase()}`)}
          </h3>
          <div className="space-y-1">
            {group.items.map((item) => {
              const isActive = pathname === `/${locale}${item.href}`;
              return (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  className={cn(
                    "sidebar-item flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      size={18}
                      className={cn(
                        isActive
                          ? "text-blue-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      )}
                    />
                    <span>{t(`links.${item.label}`)}</span>
                  </div>
                  {isActive && (
                    <ChevronRight size={14} className="text-blue-500" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
