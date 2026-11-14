import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import WhatIDo from "@/components/WhatIDo";
import Timeline from "@/components/Timeline";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <WhatIDo />
      <Timeline />
      <TechStack />
    </main>
  );
}