"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { bio, focus } from "@/data/about";
import { timeline } from "@/data/timeline";
import { techStack } from "@/data/techStack";
import { projects } from "@/data/projects";
import { contact } from "@/data/contact";

type LineKind = "input" | "output" | "error" | "system" | "thinking";
type Line = { id: number; kind: LineKind; text: string };

const PROMPT = "rayan@portfolio:~$";
const MAX_LENGTH = 300;
const COOLDOWN_MS = 3000;

const WELCOME: string[] = [
  "Welcome to RayanOS (v1.0.0).",
  "Type 'help' to see available commands or 'ask <your question>' to chat with my AI assistant.",
];

const HELP: string[] = [
  "Available commands:",
  "  help              show this list",
  "  about             who I am",
  "  skills            my tech stack",
  "  projects          things I have built",
  "  contact           how to reach me",
  "  clear             clear the terminal",
  "  ask <question>    ask my AI assistant",
  "Tip: any other text is sent to the AI as a question.",
];

function aboutLines(): string[] {
  return [
    ...bio.map((f) => `${f.label}: ${f.value.trim()}`),
    "",
    ...focus.map((f) => `${f.title}: ${f.text}`),
    "",
    ...timeline.map((t) => `${t.title.trim()} @ ${t.organization} (${t.year})`),
  ];
}

function skillsLines(): string[] {
  const groups = new Map<string, string[]>();
  for (const tech of techStack) {
    groups.set(tech.category, [...(groups.get(tech.category) ?? []), tech.name]);
  }
  return [...groups].map(([cat, names]) => `${cat.padEnd(15)} ${names.join(", ")}`);
}

function projectsLines(): string[] {
  return projects.flatMap((p) => [
    `* ${p.title}`,
    `  ${p.description}`,
    `  [${p.tags.join(", ")}]`,
    ...(p.github ? [`  GitHub: ${p.github}`] : []),
    ...(p.live ? [`  Live:   ${p.live}`] : []),
  ]);
}

function contactLines(): string[] {
  return [
    `Email:    ${contact.email}`,
    `GitHub:   ${contact.github}`,
    `LinkedIn: ${contact.linkedin}`,
  ];
}

type ChatResponse = { reply?: string; error?: string };

export default function AiConsole() {
  const nextId = useRef(WELCOME.length);
  const makeLines = (kind: LineKind, texts: string[]): Line[] =>
    texts.map((text) => ({ id: nextId.current++, kind, text }));

  const [lines, setLines] = useState<Line[]>(() =>
    WELCOME.map((text, id) => ({ id, kind: "system", text })),
  );
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    body.scrollTo({ top: body.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [lines, busy]);

  // Re-focus the input after an answer arrives (not on first page load).
  const wasBusy = useRef(false);
  useEffect(() => {
    if (wasBusy.current && !busy) inputRef.current?.focus({ preventScroll: true });
    wasBusy.current = busy;
  }, [busy]);

  const print = (kind: LineKind, texts: string[]) =>
    setLines((prev) => [...prev, ...makeLines(kind, texts)]);

  // Time of the last question sent, for the client-side cooldown.
  const lastAskAt = useRef(0);

  async function ask(question: string) {
    if (question.length > MAX_LENGTH) {
      print("error", [`Error: question is too long (max ${MAX_LENGTH} characters).`]);
      return;
    }
    const waitMs = COOLDOWN_MS - (Date.now() - lastAskAt.current);
    if (waitMs > 0) {
      print("error", [`cooldown: please wait ${Math.ceil(waitMs / 1000)}s before asking again.`]);
      return;
    }
    lastAskAt.current = Date.now();
    setBusy(true);
    try {
      // Each question is sent on its own: no conversation history.
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = (await res.json().catch(() => ({}))) as ChatResponse;
      if (res.status === 429) {
        print("error", [
          `rate limit reached: ${data.error ?? `try again in a minute, or email me at ${contact.email}.`}`,
        ]);
      } else if (res.status === 503) {
        print("error", [
          `service unavailable: ${data.error ?? `the assistant is offline, email me at ${contact.email}.`}`,
        ]);
      } else if (!res.ok || !data.reply) {
        print("error", [`Error: ${data.error ?? `request failed (${res.status})`}`]);
      } else {
        print("output", data.reply.split("\n"));
      }
    } catch {
      print("error", ["Error: could not reach the assistant. Check your connection."]);
    } finally {
      setBusy(false);
    }
  }

  async function run(raw: string) {
    const command = raw.trim();
    print("input", [command]);
    if (!command) return;

    setHistory((prev) => [...prev, command]);
    setHistoryIndex(null);

    const [name, ...rest] = command.split(/\s+/);
    switch (name.toLowerCase()) {
      case "help":
        return print("output", HELP);
      case "about":
        return print("output", aboutLines());
      case "skills":
        return print("output", skillsLines());
      case "projects":
        return print("output", projectsLines());
      case "contact":
        return print("output", contactLines());
      case "clear":
        return setLines([]);
      case "ask": {
        const question = rest.join(" ").trim();
        if (!question) return print("error", ["Usage: ask <your question>"]);
        return ask(question);
      }
      default:
        return ask(command);
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const value = input;
    setInput("");
    void run(value);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      if (history.length === 0) return;
      e.preventDefault();
      const index = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(index);
      setInput(history[index]);
    } else if (e.key === "ArrowDown") {
      if (historyIndex === null) return;
      e.preventDefault();
      const index = historyIndex + 1;
      if (index >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(index);
        setInput(history[index]);
      }
    }
  }

  const lineClass: Record<LineKind, string> = {
    input: "text-foreground",
    output: "text-foreground/85",
    error: "text-red-400",
    system: "text-muted",
    thinking: "text-muted italic",
  };

  return (
    <section id="ai" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <p className="flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.3em] text-accent">
        <span className="h-px w-12 bg-accent" />
        Ask AI
      </p>
      <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        Interactive <span className="text-accent">AI Console</span>
      </h2>
      <p className="mt-4 max-w-2xl text-muted">
        Explore my profile with terminal commands, or ask my AI assistant anything
        about my skills, projects and experience.
      </p>

      <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_0_60px_-15px] shadow-accent/30">
        {/* Title bar */}
        <div className="relative flex items-center border-b border-border bg-white/[0.03] px-4 py-3">
          <div className="flex gap-2" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <p className="absolute inset-x-0 truncate px-20 text-center font-mono text-xs text-muted">
            bash - rayan@portfolio: ~
          </p>
        </div>

        {/* Body */}
        <div
          ref={bodyRef}
          onClick={() => {
            if (!window.getSelection()?.toString()) inputRef.current?.focus();
          }}
          className="h-[380px] cursor-text overflow-y-auto bg-[#0c0c11] p-4 font-mono text-[13px] leading-relaxed sm:h-[440px] sm:p-6 sm:text-sm"
        >
          <div role="log" aria-live="polite" aria-label="Terminal output">
            {lines.map((line) =>
              line.kind === "input" ? (
                <p key={line.id} className="mt-3 break-words whitespace-pre-wrap">
                  <span className="font-semibold text-green-400">{PROMPT}</span>{" "}
                  <span className={lineClass.input}>{line.text}</span>
                </p>
              ) : (
                <p
                  key={line.id}
                  className={`min-h-[1lh] break-words whitespace-pre-wrap ${lineClass[line.kind]}`}
                >
                  {line.text}
                </p>
              ),
            )}
            {busy && <p className={lineClass.thinking}>thinking...</p>}
          </div>

          <form onSubmit={onSubmit} className="mt-3 flex items-center gap-2">
            <label htmlFor="ai-console-input" className="shrink-0 font-semibold text-green-400">
              {PROMPT}
            </label>
            <input
              id="ai-console-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={busy}
              maxLength={MAX_LENGTH}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
              aria-label="Terminal command"
              className="min-w-0 flex-1 bg-transparent text-foreground caret-accent outline-none disabled:opacity-50"
            />
          </form>
        </div>
      </div>
    </section>
  );
}
