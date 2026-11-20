"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { IconType } from "react-icons";
import { FaCode, FaTrophy, FaUser } from "react-icons/fa6";
import { bio, focus, achievements, stats } from "@/data/about";

type TabDef = { id: string; label: string; icon: IconType };

const tabs = [
  { id: "biography", label: "Biography", icon: FaUser },
  { id: "focus", label: "Core Focus", icon: FaCode },
  { id: "achievements", label: "Achievements", icon: FaTrophy },
] as const satisfies readonly TabDef[];

type TabId = (typeof tabs)[number]["id"];

const tabDomId = (id: TabId) => `about-tab-${id}`;
const panelDomId = (id: TabId) => `about-panel-${id}`;

function BiographyPanel() {
  return (
    <dl className="grid gap-x-12 gap-y-8 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-3">
      {bio.map((field) => (
        <div key={field.label}>
          <dt className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {field.label}
          </dt>
          <dd className="mt-2 text-base font-semibold text-white sm:text-lg">
            {field.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function FocusPanel() {
  return (
    <ul className="grid gap-8 sm:grid-cols-2">
      {focus.map((item) => (
        <li key={item.title}>
          <h3 className="font-semibold">{item.title}</h3>
          <p className="mt-1 text-sm text-foreground/80">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

function AchievementsPanel() {
  return (
    <ul className="space-y-4">
      {achievements.map((item) => (
        <li key={item} className="flex gap-3 text-sm">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

const panels: Record<TabId, () => ReactNode> = {
  biography: BiographyPanel,
  focus: FocusPanel,
  achievements: AchievementsPanel,
};

export default function About() {
  const [active, setActive] = useState<TabId>("biography");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;

    event.preventDefault();
    setActive(tabs[next].id);
    tabRefs.current[next]?.focus();
  }

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
        aria-label="About me"
        className="mt-10 flex flex-wrap gap-2 border-b border-border pb-4"
      >
        {tabs.map((tab, index) => {
          const selected = active === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={tabDomId(tab.id)}
              aria-selected={selected}
              aria-controls={panelDomId(tab.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                selected
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              <Icon aria-hidden="true" size={14} className="shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Panels: stacked in one grid cell so the card always takes the height
          of the tallest panel and the page never jumps when switching tabs. */}
      <div className="mt-6 grid rounded-2xl border border-border bg-surface/60 p-6 sm:p-10">
        {tabs.map((tab) => {
          const selected = active === tab.id;
          const Panel = panels[tab.id];
          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={panelDomId(tab.id)}
              aria-labelledby={tabDomId(tab.id)}
              tabIndex={selected ? 0 : -1}
              inert={!selected}
              className={`[grid-area:1/1] rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
                selected
                  ? "motion-safe:animate-[fadeIn_0.35s_ease-out]"
                  : "invisible"
              }`}
            >
              <Panel />
            </div>
          );
        })}
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
