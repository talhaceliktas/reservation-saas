"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import InvitationEmail from "@/components/emails/InvitationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

// Action'dan dönecek cevap tipi
export type CreateInvitationState = {
  error?: string;
  success?: boolean;
  message?: string;
} | null;

export async function createInvitationAction(
  prevState: CreateInvitationState,
  formData: FormData
): Promise<CreateInvitationState> {
  // FormData'dan güvenli veri çekimi
  const email = formData.get("email")?.toString();
  const role = formData.get("role")?.toString();
  const orgId = formData.get("orgId")?.toString();

  // Basit validasyon
  if (!email || !role || !orgId) {
    return { error: "Eksik bilgi gönderildi." };
  }

  // Rol tipi kontrolü (Type Guard)
  if (!["admin", "staff", "owner"].includes(role)) {
    return { error: "Geçersiz rol tipi." };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const supabase = await createClient();

  // 1. Yetki Kontrolü
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Oturum açmanız gerekiyor." };

  // 2. Profil ve Organizasyon Bilgisi
  const { data: inviterProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", orgId)
    .single();

  if (!org) return { error: "Organizasyon bulunamadı." };

  // 3. Veritabanına Kayıt
  const { data: invitation, error: dbError } = await supabase
    .from("invitations")
    .insert({
      organization_id: orgId,
      email: email,
      role: role, // Artık string değil, enum uyumlu
      invited_by: user.id,
    })
    .select("token")
    .single();

  if (dbError) {
    if (dbError.code === "23505") {
      return { error: "Bu e-posta zaten davet edilmiş." };
    }
    return { error: dbError.message };
  }

  // 4. E-Posta Gönderimi
  try {
    const inviteLink = `${baseUrl}/tr/join?token=${invitation.token}`;

    await resend.emails.send({
      from: "BookIt <onboarding@resend.dev>",
      to: email,
      subject: `${inviterProfile?.full_name} sizi ${org.name} ekibine davet etti`,
      react: InvitationEmail({
        orgName: org.name,
        inviterName: inviterProfile?.full_name || "Bir yönetici",
        role: role,
        inviteLink: inviteLink,
      }),
    });

    return { success: true, message: "Davetiye gönderildi!" };
  } catch (emailError) {
    console.error(emailError);
    // Hata tipini güvenli kontrol etme
    const errorMessage =
      emailError instanceof Error ? emailError.message : "Mail gönderilemedi";
    return { error: `Veritabanına eklendi ama mail hatası: ${errorMessage}` };
  }
}
