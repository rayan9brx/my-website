export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 pb-12 pt-4">
      <div className="relative h-px w-full bg-border">
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-px w-40 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_12px_2px_color-mix(in_srgb,var(--accent)_45%,transparent)]"
        />
      </div>
      <div className="mt-10 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-foreground/80">Designed &amp; Developed</p>
        <p className="mt-2 text-lg font-semibold">
          by <span className="text-accent">Rayan Brigui</span>
        </p>
        <p className="mt-4 text-xs text-muted">© 2026</p>
      </div>
    </footer>
  );
}
