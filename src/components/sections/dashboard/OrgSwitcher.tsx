"use client";

import { ChevronsUpDown, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OrgSwitcher() {
  // İleride burası veritabanından gelecek
  const activeOrg = { name: "Kadıköy Şube", slug: "kadikoy" };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-2 hover:bg-slate-100 h-10"
        >
          <div className="flex items-center gap-2 text-left">
            <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              K
            </div>
            <span className="text-sm font-semibold text-slate-800 truncate w-32">
              {activeOrg.name}
            </span>
          </div>
          <ChevronsUpDown size={16} className="text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="start">
        <DropdownMenuLabel className="text-xs text-slate-500 font-normal">
          Şubeler / Organizasyonlar
        </DropdownMenuLabel>

        <DropdownMenuItem className="gap-2 cursor-pointer bg-blue-50 text-blue-700 focus:bg-blue-50 focus:text-blue-700">
          <div className="h-5 w-5 rounded bg-blue-600 flex items-center justify-center text-white text-[10px]">
            K
          </div>
          <span className="flex-1 font-medium">Kadıköy Şube</span>
          <Check size={14} />
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2 cursor-pointer">
          <div className="h-5 w-5 rounded bg-slate-200 flex items-center justify-center text-slate-600 text-[10px]">
            B
          </div>
          <span className="flex-1">Beşiktaş Şube</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2 cursor-pointer text-blue-600 focus:text-blue-700">
          <Plus size={14} />
          <span className="font-medium">Yeni Organizasyon Oluştur</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
