"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useOrg } from "@/context/org-context";
import { toast } from "sonner";
import { useTranslations } from "next-intl"; // Çeviri eklendi

// Rol Tipleri
type UserRole = "owner" | "admin" | "staff";

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
  status?: string;
};

export function useStaffData() {
  const t = useTranslations("StaffPage.toasts"); // Çeviri hook'u
  const { activeOrg } = useOrg();
  const supabase = createClient();

  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!activeOrg) {
      setLoading(false);
      return;
    }

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
              profile:profiles ( full_name, email, avatar_url )
            `
            )
            .eq("organization_id", activeOrg.id),

          supabase
            .from("invitations")
            .select("*")
            .eq("organization_id", activeOrg.id),

          supabase.auth.getUser(),
        ]);

      if (membersResponse.error) throw membersResponse.error;
      if (invitationsResponse.error) throw invitationsResponse.error;

      const memberData = membersResponse.data;
      const inviteData = invitationsResponse.data;
      const user = userResponse.data.user;

      const typedMembers = memberData as unknown as Member[];
      const myRecord = typedMembers.find((m) => m.user_id === user?.id);

      setMembers(typedMembers);
      setInvitations(inviteData as Invitation[]);
      setCurrentUserRole(myRecord?.role || null);
    } catch (error: unknown) {
      console.error("Fetch error:", error);
      toast.error(t("fetchError"));
    } finally {
      setLoading(false);
    }
  }, [activeOrg, supabase, t]);

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

      toast.success(t("roleUpdated"));
      fetchData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error";
      toast.error(`${t("errorPrefix")} ${message}`);
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("organization_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      toast.success(t("memberRemoved"));
      fetchData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error";
      toast.error(`${t("errorPrefix")} ${message}`);
    }
  };

  const revokeInvitation = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from("invitations")
        .delete()
        .eq("id", inviteId);

      if (error) throw error;

      toast.success(t("invitationRevoked"));
      fetchData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error";
      toast.error(`${t("errorPrefix")} ${message}`);
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
