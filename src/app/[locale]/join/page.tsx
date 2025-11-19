import { getInvitationDetails } from "@/actions/invitations";
import { signOutAction } from "@/actions/auth"; // Yeni oluşturduğumuz action
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { CheckCircle2, XCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import JoinButton from "./JoinButton";
import { getTranslations } from "next-intl/server"; // Server-side çeviri

export default async function JoinPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ token?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const { token } = await searchParams;
  const { locale } = await params;
  const t = await getTranslations("JoinPage"); // Çeviri fonksiyonu

  // 1. Token yoksa anasayfaya at
  if (!token) {
    redirect(`/${locale}`);
  }

  // 2. Davet detaylarını çek
  const { data: invite, error } = await getInvitationDetails(token);

  // 3. Kullanıcı giriş yapmış mı kontrol et
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- HATA DURUMU (Geçersiz/Süresi dolmuş) ---
  if (error || !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md text-center border-red-200 shadow-sm">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="text-red-600" size={24} />
            </div>
            <CardTitle className="text-red-700">{t("invalid.title")}</CardTitle>
            <CardDescription>{t("invalid.desc")}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link href={`/${locale}`}>
              <Button variant="outline">{t("invalid.buttonHome")}</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Email Uyuşmazlığı Kontrolü
  const isEmailMismatch =
    user && user.email?.toLowerCase() !== invite.email.toLowerCase();

  // --- BAŞARILI DURUM ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md text-center shadow-xl border-slate-100">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
            <CheckCircle2 className="text-blue-600" size={32} />
          </div>
          <CardTitle className="text-2xl">{t("valid.title")}</CardTitle>
          <CardDescription className="text-lg mt-2">
            {/* Rich Text: Organizasyon ismini kalın yap */}
            {t.rich("valid.desc", {
              orgName: invite.organization.name,
              bold: (chunks) => (
                <span className="font-bold text-slate-900">{chunks}</span>
              ),
            })}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-slate-100 p-4 rounded-lg text-sm text-slate-600 space-y-1">
            <div>
              {t("valid.invitedEmail")}{" "}
              <span className="font-medium text-slate-900">{invite.email}</span>
            </div>
            <div>
              {t("valid.role")}{" "}
              <span className="font-medium text-slate-900 uppercase">
                {invite.role}
              </span>
            </div>
          </div>

          {/* DURUM 1: Kullanıcı Giriş Yapmamış */}
          {!user && (
            <div className="text-amber-700 text-sm bg-amber-50 p-3 rounded border border-amber-200">
              {t("warnings.unauthenticated")}
            </div>
          )}

          {/* DURUM 2: Yanlış Hesapla Giriş Yapmış */}
          {isEmailMismatch && user.email && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200 text-left">
              {t.rich("warnings.mismatch", {
                userEmail: user.email,
                inviteEmail: invite.email,
                bold: (chunks) => <span className="font-bold">{chunks}</span>,
              })}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {!user ? (
            // Giriş yapmamışsa -> Login (Geri dönüş linkiyle)
            <Link
              href={`/${locale}/login?next=/join?token=${token}`}
              className="w-full"
            >
              <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2 h-11">
                <LogIn size={18} />
                {t("buttons.login")}
              </Button>
            </Link>
          ) : isEmailMismatch ? (
            // Yanlış hesapsa -> Çıkış yap butonu
            <form action={signOutAction} className="w-full">
              <Button
                variant="outline"
                type="submit"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {t("buttons.switchAccount")}
              </Button>
            </form>
          ) : (
            // Doğru hesapsa -> Katıl Butonu
            <JoinButton token={token} locale={locale} />
          )}

          <Link
            href={`/${locale}/dashboard`}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            {t("valid.buttonDecline")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
