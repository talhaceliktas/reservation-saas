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

  const supabase = createClient();
  const refreshOrgs = useCallback(async () => {
    try {
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

      if (error) {
        console.error("Organizasyonlar çekilemedi:", error);
        throw error;
      }

      if (data) {
        const rawData = data as unknown as OrgMemberResponse[];
        const orgs = rawData.map((item) => item.organization);

        setOrganizations(orgs);

        setActiveOrg((current) => {
          if (!current && orgs.length > 0) return orgs[0];
          return current;
        });
      }
    } catch (err) {
      console.error("Context Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]); // Dependency array

  useEffect(() => {
    refreshOrgs();
  }, [refreshOrgs]);

  return (
    <OrgContext.Provider
      value={{ organizations, activeOrg, setActiveOrg, isLoading, refreshOrgs }}
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
