"use client";

import { useEffect, useState } from "react";

export default function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 2500);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span key={index} className="inline-block animate-[fadeIn_0.5s_ease]">
      {words[index]}
    </span>
  );
}