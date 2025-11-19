"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOrg } from "@/context/org-context";
import { createInvitationAction } from "@/actions/create-invitation";
import { Loader2, Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl"; // 1. Import
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function InviteMemberDialog({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const t = useTranslations("InviteDialog"); // 2. Hook Başlat
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { activeOrg } = useOrg();

  // 3. Zod Şemasını İçeri Taşıdık (Çeviriye erişmek için)
  const inviteSchema = z.object({
    email: z.string().email(t("errors.invalidEmail")),
    role: z.enum(["admin", "staff", "owner"]),
  });

  type InviteFormValues = z.infer<typeof inviteSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: "staff" },
  });

  const onSubmit = async (values: InviteFormValues) => {
    if (!activeOrg) {
      toast.error(t("errors.noOrg"));
      return;
    }

    setLoading(true);

    // FormData oluşturma
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("role", values.role);
    formData.append("orgId", activeOrg.id);

    try {
      const result = await createInvitationAction(null, formData);

      if (result?.error) {
        // Backend'den gelen hata mesajını basıyoruz.
        // Eğer backend bir kod dönüyorsa burada t(result.error) yapabiliriz.
        toast.error(result.error);
      } else {
        toast.success(t("toasts.success"));
        setOpen(false);
        reset();
        onSuccess(); // Tabloyu yenile
      }
    } catch {
      toast.error(t("errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus size={16} />
          {t("trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("desc")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>{t("labels.email")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t("placeholders.email")}
                className="pl-9"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>{t("labels.role")}</Label>
            <Select
              // Type assertion ile "any" kullanımından kaçındık
              onValueChange={(val) =>
                setValue("role", val as "admin" | "staff" | "owner")
              }
              defaultValue="staff"
            >
              <SelectTrigger>
                <SelectValue placeholder={t("placeholders.role")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">{t("roles.staff")}</SelectItem>
                <SelectItem value="admin">{t("roles.admin")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-blue-600">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("buttons.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
