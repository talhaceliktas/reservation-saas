"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Menu, X, CalendarDays, LayoutDashboard, Loader2 } from "lucide-react"; // Dashboard ikonu eklendi
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import { createBrowserClient } from "@supabase/ssr"; // Supabase client
import { User } from "@supabase/supabase-js"; // Tip tanımı

export default function Navbar({ locale }: { locale: string }) {
  const t = useTranslations("Navbar");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Kullanıcı durumu ve yükleniyor kontrolü
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Supabase Client oluştur (Env değişkenlerinin .env.local dosyasında olduğundan emin ol)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Scroll ve Kullanıcı Kontrolü
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    // Kullanıcı oturumunu kontrol et
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [supabase.auth]);

  const navLinks = [
    { href: "features", label: t("links.features") },
    { href: "pricing", label: t("links.pricing") },
    { href: "about", label: t("links.about") },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-slate-200 shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 font-bold text-2xl text-slate-900 hover:opacity-80 transition"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <CalendarDays size={20} />
          </div>
          BookIt
        </Link>

        {/* Orta Menü Linkleri */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* SAĞ TARAF (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher currentLocale={locale} />
          <div className="h-6 w-px bg-slate-200" />

          {/* Yükleniyor durumu için minik bir loader veya boşluk */}
          {loading ? (
            <Loader2 className="animate-spin text-slate-400" size={20} />
          ) : user ? (
            /* KULLANICI GİRİŞ YAPMIŞSA: DASHBOARD BUTONU */
            <Link href={`/${locale}/dashboard`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 gap-2">
                <LayoutDashboard size={18} />
                {t("buttons.dashboard")}
              </Button>
            </Link>
          ) : (
            /* GİRİŞ YAPMAMIŞSA: LOGIN & REGISTER */
            <>
              <Link href={`/${locale}/login`}>
                <Button
                  variant="ghost"
                  className="text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  {t("buttons.login")}
                </Button>
              </Link>
              <Link href={`/${locale}/register`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20">
                  {t("buttons.getStarted")}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobil Menü Butonu */}
        <button
          className="md:hidden text-slate-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBİL MENÜ */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-lg font-medium text-slate-700 py-2 border-b border-slate-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-center justify-between px-2 py-2 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-500">
                Dil / Language:
              </span>
              <LanguageSwitcher currentLocale={locale} />
            </div>

            {user ? (
              /* Mobil: Giriş Yapılmışsa */
              <Link href={`/${locale}/dashboard`} className="w-full">
                <Button className="w-full bg-blue-600 gap-2">
                  <LayoutDashboard size={18} />
                  {t("buttons.dashboard")}
                </Button>
              </Link>
            ) : (
              /* Mobil: Giriş Yapılmamışsa */
              <>
                <Link href={`/${locale}/login`} className="w-full">
                  <Button variant="outline" className="w-full justify-center">
                    {t("buttons.login")}
                  </Button>
                </Link>

                <Link href={`/${locale}/register`} className="w-full">
                  <Button className="w-full bg-blue-600">
                    {t("buttons.getStarted")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
