"use client";

import { ChevronsUpDown, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrg } from "@/context/org-context";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateOrgDialog from "./CreateOrgDialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrgSwitcher() {
  const { organizations, activeOrg, setActiveOrg, isLoading } = useOrg();
  const t = useTranslations("OrgSwitcher");

  if (isLoading) {
    return <Skeleton className="h-10 w-full rounded-md bg-slate-100" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-2 hover:bg-slate-100 h-10"
        >
          <div className="flex items-center gap-2 text-left overflow-hidden">
            <div className="h-6 w-6 min-w-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold uppercase">
              {activeOrg ? activeOrg.name.substring(0, 1) : "?"}
            </div>
            <span className="text-sm font-semibold text-slate-800 truncate">
              {/* 3. ÇEVİRİ EKLENDİ: Placeholder */}
              {activeOrg ? activeOrg.name : t("placeholder")}
            </span>
          </div>
          <ChevronsUpDown size={16} className="text-slate-400 shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60" align="start">
        <DropdownMenuLabel className="text-xs text-slate-500 font-normal">
          {t("label")}
        </DropdownMenuLabel>

        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => setActiveOrg(org)}
            className="gap-2 cursor-pointer focus:bg-slate-50"
          >
            <div
              className="h-5 w-5 rounded flex items-center justify-center text-[10px] font-bold uppercase border"
              style={{
                backgroundColor:
                  activeOrg?.id === org.id ? "#2563eb" : "#e2e8f0",
                color: activeOrg?.id === org.id ? "white" : "#475569",
                borderColor: activeOrg?.id === org.id ? "#2563eb" : "#cbd5e1",
              }}
            >
              {org.name.substring(0, 1)}
            </div>
            <span
              className={`flex-1 truncate ${
                activeOrg?.id === org.id
                  ? "font-semibold text-blue-700"
                  : "font-medium"
              }`}
            >
              {org.name}
            </span>
            {activeOrg?.id === org.id && (
              <Check size={14} className="text-blue-600" />
            )}
          </DropdownMenuItem>
        ))}

        {organizations.length === 0 && (
          <div className="px-2 py-2 text-xs text-slate-400 text-center">
            {t("empty")}
          </div>
        )}

        <DropdownMenuSeparator />

        <CreateOrgDialog>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="gap-2 cursor-pointer text-blue-600 focus:text-blue-700 focus:bg-blue-50"
          >
            <Plus size={14} />
            <span className="font-medium">{t("create")}</span>
          </DropdownMenuItem>
        </CreateOrgDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
