import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// 1. Params'ı buraya ekledik (Next.js 15'te Promise olarak gelir)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // 2. Mevcut dili URL parametrelerinden çekiyoruz
  const { locale } = await params;

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 3. DÜZELTME: Yönlendirmeye 'locale' ekliyoruz
      // Örn: localhost:3000/tr/dashboard
      return NextResponse.redirect(`${origin}/${locale}${next}`);
    }
  }

  // Hata durumunda da login sayfasına dil koduyla geri gönderiyoruz
  return NextResponse.redirect(`${origin}/${locale}/login?error=auth`);
}
