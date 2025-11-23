"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Organization = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
};

type OrgMemberResponse = {
  organization: Organization;
};

type OrgContextType = {
  organizations: Organization[];
  activeOrg: Organization | null;
  setActiveOrg: (org: Organization) => void;
  isLoading: boolean;
  refreshOrgs: () => Promise<void>;
};

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children }: { children: ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [supabase] = useState(() => createClient());

  const refreshOrgs = useCallback(async () => {
    try {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("organization_members")
        .select(
          `
          organization:organizations (
            id, name, slug, logo_url
          )
        `
        )
        .eq("user_id", user.id);

      if (error) throw error;

      if (data) {
        const rawData = data as unknown as OrgMemberResponse[];
        const orgs = rawData.map((item) => item.organization);

        setOrganizations(orgs);

        const savedOrgId = localStorage.getItem("selectedOrgId");
        const foundOrg = orgs.find((o) => o.id === savedOrgId);

        if (foundOrg) {
          setActiveOrg(foundOrg);
          document.cookie = `selectedOrgId=${foundOrg.id}; path=/; max-age=31536000; SameSite=Lax`;
        } else if (orgs.length > 0) {
          setActiveOrg(orgs[0]);
          document.cookie = `selectedOrgId=${orgs[0].id}; path=/; max-age=31536000; SameSite=Lax`;
        }
      }
    } catch (err) {
      console.error("Context Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const handleSetActiveOrg = (org: Organization) => {
    setActiveOrg(org);
    localStorage.setItem("selectedOrgId", org.id);
    document.cookie = `selectedOrgId=${org.id}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  useEffect(() => {
    refreshOrgs();
  }, [refreshOrgs]);

  return (
    <OrgContext.Provider
      value={{
        organizations,
        activeOrg,
        setActiveOrg: handleSetActiveOrg,
        isLoading,
        refreshOrgs,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
}

export const useOrg = () => {
  const context = useContext(OrgContext);
  if (!context) throw new Error("useOrg must be used within an OrgProvider");
  return context;
};
