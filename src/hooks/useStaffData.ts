"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useOrg } from "@/context/org-context";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";

// Rol Tipleri (Tekrar tekrar yazmamak için)
type UserRole = "owner" | "admin" | "staff";

// Tipler
export type Member = {
  id: string;
  user_id: string;
  role: UserRole;
  profile: {
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
};

export type Invitation = {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  // status veritabanında yoksa UI'da hesaplanabilir veya opsiyonel olabilir
  status?: string;
};

export function useStaffData() {
  const { activeOrg } = useOrg();
  const supabase = createClient();

  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!activeOrg) return;
    setLoading(true);

    try {
      const [membersResponse, invitationsResponse, userResponse] =
        await Promise.all([
          supabase
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
            .eq("organization_id", activeOrg.id),

          supabase
            .from("invitations")
            .select("*")
            .eq("organization_id", activeOrg.id),

          supabase.auth.getUser(),
        ]);

      // Hata Kontrolü
      if (membersResponse.error) throw membersResponse.error;
      if (invitationsResponse.error) throw invitationsResponse.error;

      const memberData = membersResponse.data;
      const inviteData = invitationsResponse.data;
      const user = userResponse.data.user;

      // 2. Benim Rolümü Bul
      // TypeScript'e memberData'nın Member[] yapısında olduğunu söylüyoruz (Type Assertion)
      // Eğer Supabase Type Gen kullansaydık buna gerek kalmazdı.
      const typedMembers = memberData as unknown as Member[];
      const myRecord = typedMembers.find((m) => m.user_id === user?.id);

      setMembers(typedMembers);
      setInvitations(inviteData as Invitation[]); // Invitation tipine zorluyoruz
      setCurrentUserRole(myRecord?.role || null);
    } catch (error: unknown) {
      console.error("Veri çekme hatası:", error);

      // Hata mesajını güvenli alma
      let message = "Veriler yüklenirken bir hata oluştu.";
      if (isPostgrestError(error)) {
        message = error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [activeOrg, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- FONKSİYONLAR ---

  // Rol Güncelleme
  const updateRole = async (memberId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from("organization_members")
        .update({ role: newRole })
        .eq("id", memberId);

      if (error) throw error;

      toast.success("Rol güncellendi");
      fetchData();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Bir hata oluştu";
      toast.error("Hata: " + message);
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Bir hata oluştu";
      toast.error("Hata: " + message);
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Bir hata oluştu";
      toast.error("Hata: " + message);
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

function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "code" in error
  );
}
