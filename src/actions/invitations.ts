"use server";

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Admin Client (RLS Bypass için)
const getAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

// 1. TİP GÜVENLİĞİ: Veritabanından dönen verinin tipini tanımlıyoruz
type InvitationData = {
  id: string;
  email: string;
  token: string;
  role: "owner" | "admin" | "staff";
  organization_id: string;
  expires_at: string;
  organization: {
    name: string;
  };
};

// Dönüş Tipi
type InvitationResult = {
  success?: boolean;
  error?: string; // Çeviri anahtarı (örn: "InvitationErrors.notFound")
  details?: Record<string, string>; // Çeviriye parametre geçmek için (örn: { email: ... })
  data?: InvitationData;
};

export async function getInvitationDetails(
  token: string
): Promise<InvitationResult> {
  const supabaseAdmin = getAdminClient();

  // Supabase'e ne beklediğimizi Generic olarak söylüyoruz (kısmen)
  // Ancak join işlemlerinde en temizi "as unknown as Type" ile cast etmektir.
  const { data, error } = await supabaseAdmin
    .from("invitations")
    .select(
      `
      *,
      organization:organizations(name)
    `
    )
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (error || !data) {
    console.error("Davet hatası:", error);
    return { error: "InvitationErrors.notFound" };
  }

  // Veriyi güvenli tipe dönüştür
  return { data: data as unknown as InvitationData };
}

export async function acceptInvitation(
  token: string,
  locale: string // 1. Locale parametresi eklendi
) {
  const supabaseAdmin = getAdminClient();
  const supabaseUser = await createServerClient();

  // 1. Kullanıcı Kontrolü
  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  if (!user || !user.email) {
    return { error: "InvitationErrors.unauthenticated" };
  }

  // 2. Davetiyeyi Bul
  const { data: inviteData, error: inviteError } = await supabaseAdmin
    .from("invitations")
    .select("*")
    .eq("token", token)
    .single();

  if (inviteError || !inviteData) {
    return { error: "InvitationErrors.invalid" };
  }

  const invite = inviteData;

  // 3. Email Eşleşmesi
  if (invite.email.toLowerCase() !== user.email.toLowerCase()) {
    return {
      error: "InvitationErrors.emailMismatch",
      details: {
        inviteEmail: invite.email,
        userEmail: user.email,
      },
    };
  }

  // 4. Üye Ekleme
  const { error: memberError } = await supabaseAdmin
    .from("organization_members")
    .insert({
      organization_id: invite.organization_id,
      user_id: user.id,
      role: invite.role,
    });

  if (memberError) {
    // Zaten üye ise (23505) devam et, değilse hata dön
    if (memberError.code !== "23505") {
      return {
        error: "InvitationErrors.createMemberError",
      };
    }
  }

  // 5. Davetiyeyi Sil
  await supabaseAdmin.from("invitations").delete().eq("id", invite.id);

  // 6. BAŞARILI SONUÇ: Cache Temizle ve Yönlendir
  // Layout cache'ini temizle ki yeni organizasyon menüde görünsün
  revalidatePath("/", "layout");

  // Kullanıcıyı Dashboard'a fırlat (Bu işlem bir hata fırlatır ve fonksiyonu durdurur, bu normaldir)
  redirect(`/${locale}/dashboard`);
}
