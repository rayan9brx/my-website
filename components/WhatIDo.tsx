"use client";

import { useState } from "react";
import { services } from "@/data/whatIDo";

function Corners() {
  const base = "pointer-events-none absolute h-3 w-3 border-foreground";
  return (
    <>
      <span className={`${base} -left-px -top-px border-l-2 border-t-2`} />
      <span className={`${base} -right-px -top-px border-r-2 border-t-2`} />
      <span className={`${base} -bottom-px -left-px border-b-2 border-l-2`} />
      <span className={`${base} -bottom-px -right-px border-b-2 border-r-2`} />
    </>
  );
}

export default function WhatIDo() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="what-i-do"
      className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2"
    >
      <h2 className="text-6xl font-bold uppercase leading-[0.9] tracking-tight sm:text-8xl">
        What
        <br />I <span className="text-accent">Do</span>
      </h2>

      <div className="flex flex-col">
        {services.map((service, i) => {
          const isOpen = open === i;
          return (
            <article
              key={service.title}
              className="relative border border-dashed border-white/20 p-8"
            >
              <Corners />
              <h3 className="text-2xl font-bold uppercase tracking-tight">
                {service.title}
              </h3>
              <p className="mt-1 text-sm tracking-wide text-muted">
                {service.subtitle}
              </p>
              <p
                className={`mt-4 overflow-hidden pr-10 text-sm leading-relaxed text-foreground/80 transition-all duration-300 ${
                  isOpen ? "max-h-60" : "max-h-[4.5rem]"
                }`}
              >
                {service.description}
              </p>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-label={isOpen ? "Show less" : "Show more"}
                className="absolute bottom-4 right-4 flex h-7 w-7 items-center justify-center border border-foreground/70 transition-colors hover:bg-foreground hover:text-background"
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 9l7 7 7-7" />
                </svg>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}