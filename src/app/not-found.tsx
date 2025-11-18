import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import NotFoundUI from "@/components/ui/NotFoundUI";
import "@/globals.css";

export default async function GlobalNotFound() {
  const locale = await getLocale();

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <NotFoundUI />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
