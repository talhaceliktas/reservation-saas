"use client";

import OrgSwitcher from "./OrgSwitcher";
import SidebarNav from "./SidebarNav";
import SidebarProfile from "./SidebarProfile";

export default function Sidebar({ locale }: { locale: string }) {
  return (
    <aside className="hidden lg:flex h-screen w-72 flex-col border-r border-slate-200 bg-white fixed left-0 top-0 z-40">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <OrgSwitcher />
      </div>

      <SidebarNav locale={locale} />

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <SidebarProfile locale={locale} />
      </div>
    </aside>
  );
}
