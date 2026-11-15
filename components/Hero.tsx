import Image from "next/image";
import RotatingWord from "./RotatingWord";

export default function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[calc(100vh-65px)] max-w-6xl flex-col justify-center px-6 py-16">
      <div className="grid items-center gap-12 md:grid-cols-3">
        {/* Left: name */}
        <div className="text-center md:text-left">
          <p className="flex items-center justify-center gap-3 text-xl text-accent md:justify-start">
            <span className="hidden h-px w-10 bg-accent md:block" />
            Hello! I&apos;m
          </p>
          <h1 className="mt-2 text-5xl font-bold uppercase leading-none tracking-tight">
            Rayan
          </h1>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-muted md:justify-start">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            AI &amp; Building
          </p>
        </div>

        {/* Center: photo */}
        <div className="flex flex-col items-center">
          <div className="relative h-64 w-64 overflow-hidden rounded-full border border-accent/40 shadow-[0_0_60px_rgba(59,130,246,0.35)]">
            <Image
              src="/profile.jpg"
              alt="Rayan"
              fill
              priority
              className="object-cover"
            />
          </div>
          <span className="relative z-10 -mt-4 flex items-center gap-2 rounded-full border border-accent/40 bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Open to opportunities
          </span>
        </div>

        {/* Right: rotating text */}
        <div className="text-center md:text-left">
          <p className="text-xl text-accent">Passionate about</p>
          <p className="mt-4 text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            <RotatingWord
              words={["AI", "Building", "Shipping", "Next.js"]}
            />
          </p>
        </div>
      </div>

      {/* Bottom links */}
      <div className="mt-16 flex gap-6 text-sm font-semibold uppercase tracking-wider text-muted">
        <a
          href="https://github.com/rayan9brx"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}