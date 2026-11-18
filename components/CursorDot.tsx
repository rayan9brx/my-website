"use client";

import { useEffect, useRef } from "react";

const SIZE = 30;
const HOVER_SCALE = 1.6;
const HOVER_OPACITY = 0.35;

/**
 * Trailing cursor circle that blends with the page using
 * `mix-blend-mode: difference`: over the dark background it looks light
 * blue, over text and images it inverts their colors instead of hiding them.
 *
 * Blending only works against what is painted behind this element in the
 * same stacking context, so this is a single element rendered directly in
 * <body> (see app/layout.tsx), with transform, opacity and the blend mode all
 * on the element itself, and no wrapper that would isolate it.
 */
export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices and when the visitor prefers reduced motion.
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const dot = dotRef.current;
    if (!dot) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let scale = 1;
    let targetScale = 1;
    let visible = false;
    let overLink = false;
    let frame = 0;

    const applyOpacity = () => {
      dot.style.opacity = visible ? String(overLink ? HOVER_OPACITY : 1) : "0";
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      // Over a link or button: grow a little and become a soft halo so the
      // icon or label underneath stays fully readable.
      const target = e.target instanceof Element ? e.target : null;
      overLink = target?.closest("a, button") != null;
      targetScale = overLink ? HOVER_SCALE : 1;

      visible = true;
      applyOpacity();
    };

    // Fires with no relatedTarget when the pointer leaves the window.
    const onOut = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      visible = false;
      applyOpacity();
    };

    const tick = () => {
      x += (targetX - x) * 0.15;
      y += (targetY - y) * 0.15;
      scale += (targetScale - scale) * 0.15;
      dot.style.transform = `translate3d(${x - SIZE / 2}px, ${y - SIZE / 2}px, 0) scale(${scale})`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseout", onOut);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{ width: SIZE, height: SIZE }}
      className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full bg-[color-mix(in_srgb,var(--accent)_55%,white)] shadow-[0_0_16px_6px_color-mix(in_srgb,var(--accent)_55%,transparent),0_0_40px_14px_color-mix(in_srgb,var(--accent)_25%,transparent)] opacity-0 mix-blend-difference transition-opacity duration-300 motion-reduce:hidden pointer-coarse:hidden"
    />
  );
}
