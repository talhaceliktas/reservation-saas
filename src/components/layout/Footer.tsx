"use client";

import { usePathname } from "next/navigation";
import MarketingFooter from "./MarketingFooter";

export default function Footer({ locale }: { locale: string }) {
  const pathname = usePathname();

  const isDashboard = pathname?.includes(`/${locale}/dashboard`);

  if (isDashboard) {
    return null;
  }

  return <MarketingFooter />;
}
