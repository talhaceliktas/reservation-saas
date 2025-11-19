import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/sections/home/Hero";
import Features from "@/components/sections/home/Features";
import Stats from "@/components/sections/home/Stats";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Stats />
      <Features />
    </main>
  );
}
