import Hero from "@/components/Hero";
import About from "@/components/About";
import WhatIDo from "@/components/WhatIDo";
import Timeline from "@/components/Timeline";
import TechStack from "@/components/TechStack";
import Work from "@/components/Work";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <About />
      <WhatIDo />
      <Timeline />
      <TechStack />
      <Work />
      <Contact />
    </main>
  );
}