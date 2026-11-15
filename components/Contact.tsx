import { SiGithub } from "react-icons/si";
import { MdOutlineMail } from "react-icons/md";
import { contact } from "@/data/contact";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/60 px-6 py-16 text-center sm:px-12">
        <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

        <p className="relative text-sm font-semibold uppercase tracking-[0.3em] text-accent">
          Contact
        </p>
        <h2 className="relative mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Let&apos;s work <span className="text-accent">together</span>
        </h2>
        <p className="relative mx-auto mt-4 max-w-lg text-muted">
          Have an idea, a project, or an opportunity? Send me a message and
          I&apos;ll get back to you.
        </p>

        <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            <MdOutlineMail className="text-xl" />
            Send an email
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-semibold transition-colors hover:border-accent/50 hover:text-accent"
          >
            <SiGithub className="text-xl" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}