"use client";

import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Bell, Menu, LogOut, User as UserIcon } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher"; // Bu bileşenin de dil prop'u veya hook kullanması gerekebilir
import { useTranslations } from "next-intl"; // Hook import edildi
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function DashboardNavbar({ locale }: { locale: string }) {
  const t = useTranslations("Navbar"); // "Navbar" namespace'ini okuyoruz
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push(`/${locale}/login`);
  };

  const getInitials = (email: string | undefined) => {
    return email ? email.substring(0, 2).toUpperCase() : "U";
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white w-full flex items-center px-4 md:px-8 justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-slate-500"
        >
          <Menu size={20} />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher currentLocale={locale} />

        <Button variant="ghost" size="icon" className="text-slate-500 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </Button>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border border-slate-200">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {getInitials(user?.email)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {/* Çeviri: Kullanıcı Adı Yoksa Varsayılan */}
                  {user?.user_metadata?.full_name || t("userMenu.defaultName")}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(`/${locale}/dashboard/profile`)}
              className="cursor-pointer"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              {/* Çeviri: Profilim */}
              <span>{t("userMenu.profile")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {/* Çeviri: Çıkış Yap */}
              <span>{t("userMenu.logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
