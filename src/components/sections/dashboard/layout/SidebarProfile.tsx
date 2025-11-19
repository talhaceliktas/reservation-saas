"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useFetchProfile from "../../../../hooks/useFetchProfile";
import { createClient } from "../../../../lib/supabase/client";

export default function SidebarProfile({ locale }: { locale: string }) {
  const router = useRouter();

  const supabase = createClient();

  const { profile, loading } = useFetchProfile(supabase);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push(`/${locale}/login`);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition group">
      <Avatar className="h-9 w-9 border border-slate-200 bg-white">
        <AvatarImage src={profile?.avatar_url || ""} />
        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">
          {getInitials(profile?.full_name || "")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-medium text-slate-900 truncate">
          {profile?.full_name}
        </p>
        <p className="text-xs text-slate-500 truncate">{profile?.email}</p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
        title="Çıkış Yap"
      >
        <LogOut size={16} />
      </Button>
    </div>
  );
}
