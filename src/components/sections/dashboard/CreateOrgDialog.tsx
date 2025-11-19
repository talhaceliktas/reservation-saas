"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase";
import { useOrg } from "@/context/org-context";
import { Loader2 } from "lucide-react"; // 'Plus' silindi
import { Button } from "@/components/ui/button";
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

const formSchema = z.object({
  name: z.string().min(2, "En az 2 karakter olmalı"),
  slug: z
    .string()
    .min(3, "En az 3 karakter olmalı")
    .regex(/^[a-z0-9-]+$/, "Sadece küçük harf, rakam ve tire"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateOrgDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refreshOrgs } = useOrg();
  const supabase = createClient();

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

      toast.success("Organizasyon oluşturuldu!");
      setOpen(false);
    } catch (error: unknown) {
      console.error(error);

      let errorMessage = "Bir hata oluştu";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error("Hata: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Organizasyon Oluştur</DialogTitle>
          <DialogDescription>
            Yeni bir işletme profili oluşturun. Daha sonra ayarları
            düzenleyebilirsiniz.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">İşletme Adı</Label>
            <Input
              id="name"
              {...register("name")}
              onChange={handleNameChange}
              placeholder="Örn: BookIt Kadıköy"
            />
            {errors.name && (
              <span className="text-xs text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">URL Kısa Adı (Slug)</Label>
            <div className="flex items-center">
              <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-md px-3 py-2 text-sm text-slate-500">
                bookit.com/
              </span>
              <Input
                id="slug"
                {...register("slug")}
                className="rounded-l-none"
                placeholder="kadikoy"
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
              Oluştur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
