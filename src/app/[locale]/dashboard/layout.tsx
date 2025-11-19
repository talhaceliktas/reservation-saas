import Sidebar from "@/components/sections/dashboard/Sidebar";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar locale={locale} />
      <main className="lg:pl-72 min-h-screen transition-all duration-300 ease-in-out">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
