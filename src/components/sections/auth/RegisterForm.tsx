"use client";

import { useState } from "react"; // Eklendi
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
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

interface RegisterFormProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function RegisterForm({
  onSuccess,
  onError,
}: RegisterFormProps) {
  const t = useTranslations("Auth");
  const { register, isLoading } = useAuth();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", fullName: "" },
  });

  async function onSubmit(values: RegisterInput) {
    if (!captchaToken) {
      onError(t("errors.provideBot"));
      return;
    }

    const res = await register(values, captchaToken);

    if (res.success) {
      onSuccess(t("success.register"));
      form.reset();
      setCaptchaToken(null);
    } else {
      if (res.error === "emailInUse") {
        form.setError("email", {
          type: "manual",
          message: "emailInUse",
        });
      } else {
        onError(t("errors.generic"));
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t("form.fullName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("form.fullNamePlaceholder")} {...field} />
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
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={isLoading || !captchaToken} // Token yoksa buton disable
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            t("buttons.register")
          )}
        </Button>
      </form>
    </Form>
  );
}
