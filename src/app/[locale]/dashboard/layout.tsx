import Sidebar from "@/components/sections/dashboard/layout/Sidebar";
import { ReactNode } from "react";
import { OrgProvider } from "../../../context/org-context";
import DashboardFooter from "../../../components/layout/DashboardFooter";

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
        <Sidebar locale={locale} />

        <main className="flex-1 lg:pl-72 min-h-screen flex flex-col transition-all duration-300 ease-in-out">
          <div className="flex-1 p-4 lg:p-8">{children}</div>
          <DashboardFooter />
        </main>
      </div>
    </OrgProvider>
  );
}
