import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import WhatIDo from "@/components/WhatIDo";
import Timeline from "@/components/Timeline";
import Work from "@/components/Work";
import About from "@/components/About";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <About />
      <WhatIDo />
      <Timeline />
      <Work />
      <TechStack />
    </main>
  );
}