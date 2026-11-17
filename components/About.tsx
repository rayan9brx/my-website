"use client";

import { useState } from "react";
import { bio, focus, achievements, stats } from "@/data/about";

const tabs = ["Biography", "Core Focus", "Achievements"] as const;
type Tab = (typeof tabs)[number];

export default function About() {
  const [active, setActive] = useState<Tab>("Biography");

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <p className="flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.3em] text-accent">
        <span className="h-px w-12 bg-accent" />
        About me
      </p>

      <p className="mt-6 max-w-3xl text-2xl font-semibold leading-snug sm:text-3xl">
        I&apos;m <span className="text-accent">Rayan</span>, a Computer Science
        student at Otto-von-Guericke University Magdeburg and a frontend developer
        who cares about clean, user-friendly interfaces. I build full-stack web apps
        with React, TypeScript and Spring Boot, and I&apos;m exploring how AI can
        make products smarter and easier to use.
</p>

      {/* Tabs */}
      <div
        role="tablist"
        className="mt-10 flex gap-2 border-b border-border pb-4"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
              active === tab
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div
        role="tabpanel"
        className="mt-6 min-h-[200px] rounded-2xl border border-border bg-surface/60 p-8"
      >
        {active === "Biography" && (
          <dl className="grid gap-8 sm:grid-cols-2">
            {bio.map((field) => (
              <div key={field.label}>
                <dt className="text-xs uppercase tracking-widest text-muted">
                  {field.label}
                </dt>
                <dd className="mt-1 font-semibold">{field.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {active === "Core Focus" && (
          <ul className="grid gap-8 sm:grid-cols-2">
            {focus.map((item) => (
              <li key={item.title}>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-foreground/80">{item.text}</p>
              </li>
            ))}
          </ul>
        )}

        {active === "Achievements" && (
          <ul className="space-y-4">
            {achievements.map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-surface/60 px-4 py-6 text-center"
          >
            <p className="text-3xl font-bold text-accent">{stat.value}</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}