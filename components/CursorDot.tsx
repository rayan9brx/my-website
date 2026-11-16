"use client";

import { useEffect, useRef } from "react";

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices (phones, tablets)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const inner = innerRef.current;
    if (!dot || !inner) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.opacity = "1";

      // Over a link or button: become a soft halo so the icon stays visible
      const overLink = (e.target as Element | null)?.closest("a, button");
      inner.style.transform = overLink ? "scale(1.6)" : "scale(1)";
      inner.style.opacity = overLink ? "0.18" : "1";
    };

    const onLeave = () => {
      dot.style.opacity = "0";
    };

    const tick = () => {
      x += (targetX - x) * 0.15;
      y += (targetY - y) * 0.15;
      dot.style.transform = `translate3d(${x - 25}px, ${y - 25}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] h-[50px] w-[50px] opacity-0 transition-opacity duration-300"
    >
      <div
        ref={innerRef}
        className="h-full w-full rounded-full bg-accent shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all duration-300"
      />
    </div>
  );
}