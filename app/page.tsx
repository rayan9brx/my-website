import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import WhatIDo from "@/components/WhatIDo";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <WhatIDo />
      <TechStack />
    </main>
  );
}