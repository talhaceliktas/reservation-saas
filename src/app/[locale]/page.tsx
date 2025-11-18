import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Stats from "@/components/home/Stats";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
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
