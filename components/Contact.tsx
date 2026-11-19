import type { ReactNode } from "react";
import { MdOutlineMail, MdOutlineLocationOn, MdNorthEast } from "react-icons/md";
import { HiOutlineShare } from "react-icons/hi";
import { contact } from "@/data/contact";
import ContactForm from "@/components/ContactForm";

const socials = [
  { href: contact.github, label: "GitHub" },
  { href: contact.linkedin, label: "LinkedIn" },
];

function InfoCard({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface/60 p-6 transition-colors hover:border-accent/40">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-2xl text-accent">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
        <div className="mt-1 text-base font-medium sm:text-lg">{children}</div>
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-4xl font-bold uppercase tracking-tight sm:text-5xl">
          Let&apos;s <span className="text-accent">Connect</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Have a project idea, a collaboration opportunity, or just want to connect? Feel free to
          reach out.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-[2fr_3fr]">
        <div className="flex flex-col gap-6">
          <InfoCard icon={<MdOutlineMail aria-hidden />} label="Email">
            <a
              href={`mailto:${contact.email}`}
              className="break-all transition-colors hover:text-accent"
            >
              {contact.email}
            </a>
          </InfoCard>

          <InfoCard icon={<MdOutlineLocationOn aria-hidden />} label="Location">
            <p>{contact.location}</p>
          </InfoCard>

          <InfoCard icon={<HiOutlineShare aria-hidden />} label="Social">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {socials.map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                  >
                    {label}
                    <MdNorthEast aria-hidden className="text-sm" />
                  </a>
                </li>
              ))}
            </ul>
          </InfoCard>
        </div>

        <div className="rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
