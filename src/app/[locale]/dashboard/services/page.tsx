import { getServices } from "@/actions/services";
import { ServiceList } from "@/components/sections/dashboard/services/ServiceList";
import { getTranslations } from "next-intl/server";

export default async function ServicesPage() {
  const services = await getServices();
  const t = await getTranslations("ServicesPage");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>
      <ServiceList initialServices={services} />
    </div>
  );
}
