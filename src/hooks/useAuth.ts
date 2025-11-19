import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LoginInput, RegisterInput } from "@/lib/validations/auth";
import { checkEmailExists } from "../actions/auth-check";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const login = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      router.refresh();
      router.push("/dashboard");
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Bilinmeyen hata" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const emailExists = await checkEmailExists(data.email);

      if (emailExists) {
        throw new Error("emailInUse");
      }

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) throw error;

      return { success: true };
    } catch (error: unknown) {
      let errorMessage = "generic";

      if (error instanceof Error) {
        if (error.message === "emailInUse") {
          errorMessage = "emailInUse";
        } else if (error.message.includes("already registered")) {
          errorMessage = "emailInUse";
        } else {
          console.error("Kayıt hatası:", error.message);
        }
      }

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Bilinmeyen hata" };
    } finally {
    }
  };

  return {
    login,
    register,
    loginWithGoogle,
    isLoading,
  };
}
