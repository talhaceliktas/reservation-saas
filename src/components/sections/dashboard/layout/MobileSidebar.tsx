"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import SidebarNav from "./SidebarNav";
import SidebarProfile from "./SidebarProfile";
import OrgSwitcher from "./OrgSwitcher";
import { useState } from "react";

export default function MobileSidebar({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <div className="h-full flex flex-col bg-white">
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <OrgSwitcher />
          </div>

          <SidebarNav locale={locale} />

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <SidebarProfile locale={locale} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
