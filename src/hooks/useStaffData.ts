"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/supabase";
import { useOrg } from "@/context/org-context";
import { toast } from "sonner";

// Tipler
export type Member = {
  id: string;
  user_id: string;
  role: "owner" | "admin" | "staff";
  profile: {
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
};

export type Invitation = {
  id: string;
  email: string;
  role: "owner" | "admin" | "staff";
  created_at: string;
  status: string;
};

export function useStaffData() {
  const { activeOrg } = useOrg();
  const supabase = createClient();

  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!activeOrg) return;
    setLoading(true);

    try {
      // 1. Mevcut Üyeleri Çek
      const { data: memberData, error: memberError } = await supabase
        .from("organization_members")
        .select(
          `
          id,
          user_id,
          role,
          profile:profiles (
            full_name,
            email,
            avatar_url
          )
        `
        )
        .eq("organization_id", activeOrg.id);

      if (memberError) throw memberError;

      // 2. Davetiyeleri Çek
      const { data: inviteData, error: inviteError } = await supabase
        .from("invitations")
        .select("*")
        .eq("organization_id", activeOrg.id);

      if (inviteError) throw inviteError;

      // 3. Benim Rolüm Ne? (Yetki kontrolü için)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const myRecord = memberData.find((m) => m.user_id === user?.id);

      setMembers(memberData as unknown as Member[]);
      setInvitations(inviteData as Invitation[]);
      setCurrentUserRole(myRecord?.role || null);
    } catch (error: any) {
      console.error("Veri çekme hatası:", error);
      toast.error("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [activeOrg, supabase]);

  // Sayfa yüklenince veya organizasyon değişince çalıştır
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- FONKSİYONLAR ---

  // Rol Güncelleme (Sadece Owner/Admin yapabilir - RLS de korur ama UI da korumalı)
  const updateRole = async (memberId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("organization_members")
        .update({ role: newRole })
        .eq("id", memberId);

      if (error) throw error;

      toast.success("Rol güncellendi");
      fetchData(); // Listeyi yenile
    } catch (error: any) {
      toast.error("Hata: " + error.message);
    }
  };

  // Üye Çıkarma
  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("organization_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      toast.success("Kullanıcı organizasyondan çıkarıldı");
      fetchData();
    } catch (error: any) {
      toast.error("Hata: " + error.message);
    }
  };

  // Davet İptal Etme
  const revokeInvitation = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from("invitations")
        .delete()
        .eq("id", inviteId);

      if (error) throw error;

      toast.success("Davet iptal edildi");
      fetchData();
    } catch (error: any) {
      toast.error("Hata: " + error.message);
    }
  };

  return {
    members,
    invitations,
    currentUserRole,
    loading,
    refresh: fetchData,
    updateRole,
    removeMember,
    revokeInvitation,
  };
}
