"use client";

import { useEffect, useRef } from "react";

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices (phones, tablets)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.opacity = "1";
    };

    const onLeave = () => {
      dot.style.opacity = "0";
    };

    const tick = () => {
      // Move 15% of the remaining distance each frame: smooth trailing
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
      className="pointer-events-none fixed left-0 top-0 z-[100] h-[50px] w-[50px] rounded-full bg-accent opacity-0 shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-opacity duration-300"
    />
  );
}