"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Scissors,
  Settings,
  BriefcaseBusiness,
  LogOut,
  LifeBuoy,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import OrgSwitcher from "./OrgSwitcher"; // Birazdan yapacağız
import { useGSAP } from "@gsap/react";

// Menü yapımız veritabanına göre şekillendi
const sidebarItems = [
  {
    group: "Main",
    items: [
      { icon: LayoutDashboard, label: "dashboard", href: "/dashboard" },
      { icon: CalendarDays, label: "calendar", href: "/dashboard/calendar" }, // appointments tablosu
      { icon: Users, label: "customers", href: "/dashboard/customers" }, // customers tablosu
    ],
  },
  {
    group: "Management",
    items: [
      { icon: Scissors, label: "services", href: "/dashboard/services" }, // services tablosu
      { icon: BriefcaseBusiness, label: "staff", href: "/dashboard/staff" }, // organization_members tablosu
    ],
  },
  {
    group: "System",
    items: [
      { icon: Settings, label: "settings", href: "/dashboard/settings" },
      { icon: LifeBuoy, label: "support", href: "/dashboard/support" },
    ],
  },
];

export default function Sidebar({ locale }: { locale: string }) {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // GSAP Giriş Animasyonu ⚡
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sidebar-item",
        {
          x: -20,
          opacity: 0,
        },
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
    }, sidebarRef);

    return () => ctx.revert();
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className="hidden lg:flex h-screen w-72 flex-col border-r border-slate-200 bg-white fixed left-0 top-0 z-40"
    >
      {/* 1. HEADER: Logo ve Şube Seçici */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <OrgSwitcher />
      </div>

      {/* 2. BODY: Menü Linkleri */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
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

      {/* 3. FOOTER: Kullanıcı Profili */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition cursor-pointer group">
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-slate-900 truncate">
              Ahmet Yılmaz
            </p>
            <p className="text-xs text-slate-500 truncate">ahmet@bookit.com</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-600"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </aside>
  );
}
