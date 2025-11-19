"use client";

import { usePathname } from "next/navigation";
import MarketingNavbar from "./MarketingNavbar";
import DashboardNavbar from "./DashboardNavbar";

export default function Navbar({ locale }: { locale: string }) {
  const pathname = usePathname();

  const isDashboard = pathname?.includes(`/${locale}/dashboard`);

  if (isDashboard) {
    return <DashboardNavbar locale={locale} />;
  }

  return <MarketingNavbar locale={locale} />;
}
