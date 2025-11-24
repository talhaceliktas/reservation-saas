import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  defaultLocale: "en",
  locales: routing.locales,
  localePrefix: "always",
});

export default async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);

  return await updateSession(request, response);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
