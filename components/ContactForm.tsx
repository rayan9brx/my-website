"use client";

import { useState, type FormEvent } from "react";
import { RiSendPlaneFill } from "react-icons/ri";

// Same limits as the server route in app/api/contact/route.ts.
const NAME_MIN = 2;
const NAME_MAX = 80;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const FALLBACK_ERROR =
  "Your message could not be sent. Please try again later or email me directly using the address shown on this page.";

function validate(name: string, email: string, message: string): string | null {
  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    return `Name must be ${NAME_MIN} to ${NAME_MAX} characters.`;
  }
  if (!EMAIL_PATTERN.test(email)) return "Please enter a valid email address.";
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
    return `Message must be ${MESSAGE_MIN} to ${MESSAGE_MAX} characters.`;
  }
  return null;
}

const labelClass = "text-xs font-semibold uppercase tracking-[0.2em] text-muted";
const inputClass =
  "mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const sending = status.kind === "sending";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const website = String(data.get("website") ?? "");

    const problem = validate(name, email, message);
    if (problem) {
      setStatus({ kind: "error", message: problem });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      if (response.ok) {
        form.reset();
        setStatus({ kind: "success" });
        return;
      }
      const payload: unknown = await response.json().catch(() => null);
      const error =
        payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
          ? payload.error
          : FALLBACK_ERROR;
      setStatus({ kind: "error", message: error });
    } catch {
      setStatus({ kind: "error", message: FALLBACK_ERROR });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col gap-5">
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Your name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          minLength={NAME_MIN}
          maxLength={NAME_MAX}
          autoComplete="name"
          placeholder="Jane Doe"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Your email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          minLength={MESSAGE_MIN}
          maxLength={MESSAGE_MAX}
          placeholder="Tell me about your idea or project..."
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* Honeypot: hidden from people and screen readers, bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={sending}
        aria-busy={sending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
      >
        {sending ? (
          <>
            <span
              aria-hidden
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none"
            />
            Sending...
          </>
        ) : (
          <>
            <RiSendPlaneFill aria-hidden className="text-lg" />
            Send Message
          </>
        )}
      </button>

      <div aria-live="polite" role="status" className="min-h-6 text-sm">
        {status.kind === "success" && (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-300">
            Thanks, your message was sent.
          </p>
        )}
        {status.kind === "error" && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
