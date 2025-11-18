import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="text-xl mt-4">{t("subtitle")}</p>
    </div>
  );
}
