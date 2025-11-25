import { getOrganizationBySlug } from "@/actions/organizations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import BookingWizard from "@/components/booking/BookingWizard";
import { notFound } from "next/navigation";
import { Clock, Star, MapPin, Phone, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export default async function OrganizationPage({ params }: PageProps) {
  const { slug } = await params;
  const organization = await getOrganizationBySlug(slug);
  const t = await getTranslations("OrganizationPage");

  if (!organization) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-900 to-slate-900 opacity-90" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar className="h-32 w-32 border-4 border-white/20 shadow-2xl">
              <AvatarImage src={organization.logoUrl} alt={organization.name} />
              <AvatarFallback className="text-4xl bg-blue-600 text-white">
                {organization.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left space-y-4 flex-1">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {organization.name}
                </h1>
                <Badge className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 border-blue-500/50">
                  {t("hero.verified")}
                </Badge>
              </div>
              <p className="text-lg text-slate-300 max-w-2xl">
                {t("hero.description")}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400 fill-yellow-400" size={16} />
                  <span className="text-white font-medium">4.9</span> (120+{" "}
                  {t("hero.reviews")})
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{t("hero.location")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{t("hero.openToday")}</span>
                </div>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  {t("hero.bookAppointment")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                <DialogTitle className="sr-only">
                  {t("hero.bookAppointment")}
                </DialogTitle>
                <BookingWizard
                  organizationId={organization.id}
                  services={organization.services}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            {t("services.title")}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            {t("services.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {organization.services.map((service) => (
            <Card
              key={service.id}
              className="group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-100"
                  >
                    {service.duration} {t("services.durationMin")}
                  </Badge>
                  <div className="text-2xl font-bold text-slate-900">
                    {service.price}{" "}
                    <span className="text-sm font-normal text-slate-500">
                      {service.currency}
                    </span>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {service.name}
                </CardTitle>
                {service.description && (
                  <CardDescription className="line-clamp-2 mt-2">
                    {service.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardFooter className="pt-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-slate-900 hover:bg-blue-600 transition-colors group-hover:shadow-md">
                      {t("services.bookNow")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                    <DialogTitle className="sr-only">
                      {t("hero.bookAppointment")} - {service.name}
                    </DialogTitle>
                    <BookingWizard
                      organizationId={organization.id}
                      services={organization.services}
                      preSelectedServiceId={service.id}
                    />
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>

        {organization.services.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Clock size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900">
              {t("services.noServices")}
            </h3>
            <p className="text-slate-500">{t("services.checkBack")}</p>
          </div>
        )}
      </div>

      {/* Contact / Info Section */}
      <div className="bg-white border-t border-slate-200 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-bold text-lg mb-4">{t("about.title")}</h3>
              <p className="text-slate-500 leading-relaxed">
                {t("about.description")}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{t("contact.title")}</h3>
              <ul className="space-y-3 text-slate-500">
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <Phone size={18} className="text-blue-600" />
                  <span>+90 (555) 123 45 67</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <Mail size={18} className="text-blue-600" />
                  <span>contact@{organization.slug}.com</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  <span>123 Main St, Istanbul</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{t("hours.title")}</h3>
              <ul className="space-y-2 text-slate-500">
                <li className="flex justify-between max-w-xs mx-auto md:mx-0">
                  <span>{t("hours.monFri")}</span>
                  <span>09:00 - 18:00</span>
                </li>
                <li className="flex justify-between max-w-xs mx-auto md:mx-0">
                  <span>{t("hours.sat")}</span>
                  <span>10:00 - 16:00</span>
                </li>
                <li className="flex justify-between max-w-xs mx-auto md:mx-0">
                  <span>{t("hours.sun")}</span>
                  <span className="text-red-500">{t("hours.closed")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
