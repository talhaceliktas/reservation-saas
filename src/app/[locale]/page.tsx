import Hero from "../../components/home/Hero";
import Features from "../../components/home/Features";
import Stats from "../../components/home/Stats";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Stats />
      <Features />
    </main>
  );
}
