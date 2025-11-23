import Sidebar from "@/components/sections/dashboard/layout/Sidebar";
import DashboardFooter from "@/components/sections/dashboard/layout/DashboardFooter";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import { ReactNode } from "react";
import { OrgProvider } from "../../../context/org-context";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <OrgProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <Sidebar locale={locale} />

        {/* Main Content */}
        <main className="flex-1 lg:pl-72 min-h-screen flex flex-col transition-all duration-300 ease-in-out">
          <DashboardNavbar locale={locale} />
          <div className="flex-1 p-4 lg:p-8">{children}</div>
          <DashboardFooter />
        </main>
      </div>
    </OrgProvider>
  );
}
