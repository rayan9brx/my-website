"use client";

import { useEffect, useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";

const SHOW_AFTER_PX = 400;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  function scrollToTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-accent/60 bg-surface/90 text-2xl text-accent shadow-[0_0_16px_color-mix(in_srgb,var(--accent)_30%,transparent)] ring-2 ring-accent/20 backdrop-blur transition-all duration-300 hover:bg-accent hover:text-white motion-reduce:transition-none md:bottom-8 md:right-8 ${
        visible ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <MdKeyboardArrowUp aria-hidden />
    </button>
  );
}
