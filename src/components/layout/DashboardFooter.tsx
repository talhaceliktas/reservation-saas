"use client";

import { useTranslations } from "next-intl";

export default function DashboardFooter() {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-100 bg-white py-6 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p>
          &copy; {currentYear} BookIt. {t("copyright")}
        </p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-900 transition-colors">
            {t("links.privacy")}
          </a>
          <a href="#" className="hover:text-slate-900 transition-colors">
            {t("links.terms")}
          </a>
          <a href="#" className="hover:text-slate-900 transition-colors">
            {t("links.contact")}
          </a>
        </div>
      </div>
    </footer>
  );
}
