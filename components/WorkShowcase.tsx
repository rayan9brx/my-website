"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Must match the .work-* media query in app/globals.css. */
const PINNED_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const DEFAULT_NAV_HEIGHT = 65;

type Props = { count: number; heading: ReactNode; children: ReactNode };

type Measurements = { navHeight: number; distance: number; wrapperTop: number };

export default function WorkShowcase({ count, heading, children }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!section || !viewport || !track || !bar) return;

    const media = window.matchMedia(PINNED_QUERY);
    let pinned = media.matches;
    let frame = 0;
    let lastIndex = -1;
    let m: Measurements = { navHeight: DEFAULT_NAV_HEIGHT, distance: 0, wrapperTop: 0 };

    const setIndex = (progress: number) => {
      const index = Math.min(count - 1, Math.max(0, Math.round(progress * (count - 1))));
      if (index !== lastIndex) {
        lastIndex = index;
        setActive(index);
      }
    };

    // Reads only. Writes happen afterwards in applyLayout / render.
    const measure = (): Measurements => {
      const nav = document.querySelector("body > header");
      const navHeight = nav instanceof HTMLElement ? nav.offsetHeight : DEFAULT_NAV_HEIGHT;
      return {
        navHeight,
        distance: Math.max(0, track.scrollWidth - viewport.clientWidth),
        wrapperTop: section.getBoundingClientRect().top + window.scrollY,
      };
    };

    const render = () => {
      frame = 0;
      if (pinned) {
        const top = section.getBoundingClientRect().top;
        const progress = m.distance > 0 ? Math.min(1, Math.max(0, (m.navHeight - top) / m.distance)) : 0;
        track.style.transform = `translate3d(${-progress * m.distance}px, 0, 0)`;
        bar.style.transform = `scaleX(${progress})`;
        setIndex(progress);
      } else {
        const max = viewport.scrollWidth - viewport.clientWidth;
        const progress = max > 0 ? viewport.scrollLeft / max : 0;
        bar.style.transform = `scaleX(${progress})`;
        setIndex(progress);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const applyLayout = () => {
      pinned = media.matches;
      // Clear old writes before measuring so the track has its natural width.
      section.style.removeProperty("height");
      track.style.removeProperty("transform");
      m = measure();
      section.style.setProperty("--nav-h", `${m.navHeight}px`);
      if (pinned) {
        section.style.height = `${window.innerHeight - m.navHeight + m.distance}px`;
      }
      render();
    };

    // The browser scrolls overflow-hidden boxes to reveal focused elements; undo that.
    const keepViewportStill = () => {
      if (pinned && viewport.scrollLeft !== 0) viewport.scrollLeft = 0;
      if (!pinned) schedule();
    };

    // Tabbing into an off-screen column: scroll the page so that column is in view.
    const onFocusIn = (event: FocusEvent) => {
      if (!pinned || !(event.target instanceof Element)) return;
      const column = event.target.closest<HTMLElement>("[data-project]");
      if (!column || m.distance === 0) return;
      viewport.scrollLeft = 0;
      const current = -new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
      const left = column.offsetLeft;
      const right = left + column.offsetWidth;
      const width = viewport.clientWidth;
      let target = current;
      if (left < current) target = left;
      else if (right > current + width) target = right - width;
      if (target === current) return;
      const offset = Math.min(m.distance, Math.max(0, target));
      window.scrollTo({ top: m.wrapperTop - m.navHeight + offset, behavior: "instant" });
    };

    let resizeFrame = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(applyLayout);
    };

    applyLayout();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    media.addEventListener("change", applyLayout);
    viewport.addEventListener("scroll", keepViewportStill, { passive: true });
    track.addEventListener("focusin", onFocusIn);
    track.addEventListener("load", onResize, true);
    const observer = new ResizeObserver(onResize);
    observer.observe(track);
    void document.fonts?.ready.then(onResize);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      media.removeEventListener("change", applyLayout);
      viewport.removeEventListener("scroll", keepViewportStill);
      track.removeEventListener("focusin", onFocusIn);
      track.removeEventListener("load", onResize, true);
      observer.disconnect();
      section.style.removeProperty("height");
      track.style.removeProperty("transform");
    };
  }, [count]);

  const counter = `${String(active + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="My projects"
      className="relative scroll-mt-[var(--nav-h,65px)] py-24 [--nav-h:65px] work-section"
    >
      <div className="work-sticky flex flex-col">
        <div className="work-header mx-auto w-full max-w-6xl px-6">
          <div className="flex items-end justify-between gap-4">
            {heading}
            <div aria-hidden className="flex items-center gap-3 pb-1">
              <div className="hidden gap-1.5 sm:flex">
                {Array.from({ length: count }, (_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                      i === active ? "w-5 bg-accent" : "w-1.5 bg-border"
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-xs tracking-widest text-muted">{counter}</span>
            </div>
          </div>
          <div className="relative mt-6 h-px w-full bg-border">
            <div
              ref={barRef}
              className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-accent shadow-[0_0_8px_var(--accent)]"
            />
          </div>
        </div>

        <div
          ref={viewportRef}
          className="mt-2 flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain work-viewport"
        >
          <div ref={trackRef} className="flex h-full w-max border-l border-border work-track">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
