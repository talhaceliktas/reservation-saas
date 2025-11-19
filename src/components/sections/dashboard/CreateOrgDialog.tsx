"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase";
import { useOrg } from "@/context/org-context";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl"; // 1. IMPORT
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Tip tanımını dışarıda tutabiliriz ama şemayı içeri alacağız
type FormValues = {
  name: string;
  slug: string;
};

export default function CreateOrgDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("CreateOrg");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refreshOrgs } = useOrg();
  const supabase = createClient();

  const formSchema = z.object({
    name: z.string().min(2, t("errors.min2")),
    slug: z
      .string()
      .min(3, t("errors.min3"))
      .regex(/^[a-z0-9-]+$/, t("errors.regex")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("name", val);

    const slug = val
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    setValue("slug", slug);
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc("create_organization", {
        org_name: values.name,
        org_slug: values.slug,
      });

      if (error) throw error;

      await refreshOrgs();

      toast.success(t("toasts.success"));
      setOpen(false);
    } catch (error: unknown) {
      console.error(error);

      let errorMessage = t("errors.generic");
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(t("toasts.errorPrefix") + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("desc")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t("labels.name")}</Label>
            <Input
              id="name"
              {...register("name")}
              onChange={handleNameChange}
              placeholder={t("placeholders.name")}
            />
            {errors.name && (
              <span className="text-xs text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">{t("labels.slug")}</Label>
            <div className="flex items-center">
              <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-md px-3 py-2 text-sm text-slate-500">
                bookit.com/
              </span>
              <Input
                id="slug"
                {...register("slug")}
                className="rounded-l-none"
                placeholder={t("placeholders.slug")}
              />
            </div>
            {errors.slug && (
              <span className="text-xs text-red-500">
                {errors.slug.message}
              </span>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("buttons.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
