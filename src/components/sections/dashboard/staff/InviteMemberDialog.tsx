"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/supabase";
import { useOrg } from "@/context/org-context";
import { Loader2, Mail, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Form Şeması
const inviteSchema = z.object({
  email: z.string().email("Geçerli bir e-posta giriniz"),
  role: z.enum(["admin", "staff", "owner"]),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

export default function InviteMemberDialog({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { activeOrg } = useOrg();
  const supabase = createClient();

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
    if (!activeOrg) return;
    setLoading(true);

    try {
      // Davetiye tablosuna ekle
      const { error } = await supabase.from("invitations").insert({
        organization_id: activeOrg.id,
        email: values.email,
        role: values.role,
      });

      if (error) throw error;

      toast.success("Davet gönderildi!");
      setOpen(false);
      reset();
      onSuccess(); // Listeyi yenilemesi için üst bileşene haber ver
    } catch (error: any) {
      // Unique constraint hatası (zaten davetli)
      if (error.code === "23505") {
        toast.error("Bu e-posta zaten davet edilmiş.");
      } else {
        toast.error("Hata: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus size={16} />
          Personel Davet Et
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Üye Davet Et</DialogTitle>
          <DialogDescription>
            Ekibe yeni birini eklemek için e-posta adresini girin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>E-Posta Adresi</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="ornek@sirket.com"
                className="pl-9"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Yetki / Rol</Label>
            <Select
              onValueChange={(val: any) => setValue("role", val)}
              defaultValue="staff"
            >
              <SelectTrigger>
                <SelectValue placeholder="Rol Seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Personel (Staff)</SelectItem>
                <SelectItem value="admin">Yönetici (Admin)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-blue-600">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Davet Gönder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
