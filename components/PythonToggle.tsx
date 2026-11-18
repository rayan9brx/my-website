"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { FiChevronDown } from "react-icons/fi";

export const PYTHON_PANEL_ID = "python-courses";

type ToggleState = { open: boolean; toggle: () => void };

const ToggleContext = createContext<ToggleState | null>(null);

function useToggle(): ToggleState {
  const ctx = useContext(ToggleContext);
  if (!ctx) throw new Error("PythonToggle parts must be inside <PythonToggleProvider>.");
  return ctx;
}

/** Holds the open/closed state. Children can be server-rendered content. */
export function PythonToggleProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <ToggleContext.Provider value={{ open, toggle: () => setOpen((o) => !o) }}>
      {children}
    </ToggleContext.Provider>
  );
}

/** The clickable "Python courses" stat card. `children` is the card content. */
export function PythonStatButton({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const { open, toggle } = useToggle();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-controls={PYTHON_PANEL_ID}
      className={`${className} flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 transition-colors duration-300 hover:border-accent/50 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        open ? "border-accent/50" : ""
      }`}
    >
      {children}
      <span className="flex items-center justify-center gap-1 text-[11px] leading-none text-muted">
        {open ? "Click to hide" : "Click to see the courses"}
        <FiChevronDown
          aria-hidden="true"
          className={`shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
        />
      </span>
    </button>
  );
}

/** Collapsible region for the Python block (grid-rows 0fr -> 1fr). */
export function PythonPanel({ label, children }: { label: string; children: ReactNode }) {
  const { open } = useToggle();
  const ref = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(open);

  // When it opens (not on first render, not on close), scroll just enough to
  // show the whole box. Waits for the expand transition so the final height
  // is known; "nearest" means no scroll at all if it already fits on screen.
  useEffect(() => {
    const el = ref.current;
    const justOpened = open && !wasOpen.current;
    wasOpen.current = open;
    if (!el || !justOpened) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveal = () =>
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });

    if (reduce) {
      const frame = requestAnimationFrame(reveal);
      return () => cancelAnimationFrame(frame);
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      reveal();
    };
    const onEnd = (e: TransitionEvent) => {
      if (e.target === el && e.propertyName === "grid-template-rows") finish();
    };
    el.addEventListener("transitionend", onEnd);
    const fallback = window.setTimeout(finish, 700);
    return () => {
      el.removeEventListener("transitionend", onEnd);
      window.clearTimeout(fallback);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      id={PYTHON_PANEL_ID}
      role="region"
      aria-label={label}
      inert={!open}
      className="grid scroll-mt-20 transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none"
      style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
