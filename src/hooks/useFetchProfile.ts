import { useEffect, useState } from "react";
import { SupabaseClient } from "@supabase/supabase-js";

type UserProfileData = {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

export default function useFetchProfile(supabase: SupabaseClient) {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single();

        setProfile({
          full_name: profileData?.full_name || "İsimsiz Kullanıcı",
          email: user.email || "",
          avatar_url: profileData?.avatar_url || null,
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  return { profile, loading };
}
