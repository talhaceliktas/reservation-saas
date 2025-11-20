"use client";

import { useState } from "react"; // Eklendi
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/useAuth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile"; // Eklendi

interface LoginFormProps {
  onError: (msg: string) => void;
}

export default function LoginForm({ onError }: LoginFormProps) {
  const t = useTranslations("Auth");
  const { login, isLoading } = useAuth();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null); // Token state

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    // Captcha kontrolü
    if (!captchaToken) {
      onError(t("errors.provideBot")); // İstenilen hata mesajı
      return;
    }

    // Token login fonksiyonuna iletiliyor
    const res = await login(values, captchaToken);

    if (!res.success) {
      onError(t("errors.generic"));
      // Başarısız olursa yeni token almak gerekebilir, Turnstile bunu genelde kendi yönetir
      // ama manuel sıfırlama gerekirse ref kullanılabilir.
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t("form.email")}</FormLabel>
              <FormControl>
                <Input placeholder={t("form.emailPlaceholder")} {...field} />
              </FormControl>
              {fieldState.error?.message && (
                <p className="text-sm font-medium text-red-500">
                  {t(`errors.${fieldState.error.message}`)}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t("form.password")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("form.passwordPlaceholder")}
                  {...field}
                />
              </FormControl>
              {fieldState.error?.message && (
                <p className="text-sm font-medium text-red-500">
                  {t(`errors.${fieldState.error.message}`)}
                </p>
              )}
            </FormItem>
          )}
        />

        {/* Turnstile Bileşeni Eklendi */}
        <div className="flex justify-center">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onSuccess={(token) => setCaptchaToken(token)}
            options={{
              theme: "light",
            }}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isLoading || !captchaToken} // Token yoksa buton pasif
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            t("buttons.login")
          )}
        </Button>
      </form>
    </Form>
  );
}
