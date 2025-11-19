import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

export async function updateSession(
  request: NextRequest,
  i18nResponse: NextResponse
) {
  let response = i18nResponse;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const nextUrl = request.nextUrl;

  const locale = nextUrl.pathname.split("/")[1] || routing.defaultLocale;

  const pathNameWithoutLocale =
    nextUrl.pathname.replace(`/${locale}`, "") || "/";

  if (pathNameWithoutLocale.startsWith("/dashboard") && !user) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("next", pathNameWithoutLocale);
    return NextResponse.redirect(loginUrl);
  }

  if (
    (pathNameWithoutLocale === "/login" ||
      pathNameWithoutLocale === "/register") &&
    user
  ) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return response;
}
