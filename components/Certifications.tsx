import Image from "next/image";
import type { IconType } from "react-icons";
import {
  FiAward,
  FiArrowUpRight,
  FiBookOpen,
  FiCalendar,
  FiLayers,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import { certifications, type Certification } from "@/data/certifications";

const cardHover =
  "transition-all duration-300 hover:border-accent/50 hover:bg-surface motion-safe:hover:-translate-y-1";

function CredentialLink({ cert }: { cert: Certification }) {
  if (!cert.credentialUrl) return null;
  return (
    <a
      href={cert.credentialUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted transition-colors hover:text-accent"
    >
      View credential
      <FiArrowUpRight
        aria-hidden="true"
        className="transition-transform motion-safe:group-hover/link:-translate-y-0.5 motion-safe:group-hover/link:translate-x-0.5"
      />
      <span className="sr-only">for {cert.title} (opens in a new tab)</span>
    </a>
  );
}

function IssuedDate({ issued }: { issued: string }) {
  return (
    <p className="flex items-center gap-1.5 text-sm text-muted">
      <FiCalendar aria-hidden="true" />
      Issued {issued}
    </p>
  );
}

function FeaturedCard({ cert }: { cert: Certification }) {
  return (
    <article
      className={`relative overflow-hidden rounded-3xl border border-border bg-surface/60 p-6 sm:p-8 ${cardHover}`}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative grid items-center gap-8 md:grid-cols-[280px_1fr]">
        {cert.image ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-background">
            <Image
              src={cert.image}
              alt={`${cert.title} certificate`}
              width={560}
              height={400}
              sizes="(min-width: 768px) 280px, 100vw"
              className="h-auto w-full object-cover"
            />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="relative flex aspect-[7/5] items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent/20 via-surface to-background"
          >
            <div className="absolute inset-6 rounded-xl border border-dashed border-accent/25" />
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-4xl text-accent">
              <FiAward />
            </div>
          </div>
        )}

        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <FiStar aria-hidden="true" />
            Featured achievement
          </p>

          <h3 className="mt-4 text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
            {cert.title}
          </h3>
          <p className="mt-2 font-semibold text-accent">{cert.issuer}</p>
          <p className="mt-4 leading-relaxed text-foreground/80">{cert.description}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {cert.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <IssuedDate issued={cert.issued} />
            <CredentialLink cert={cert} />
          </div>
        </div>
      </div>
    </article>
  );
}

function CertCard({ cert, index }: { cert: Certification; index: number }) {
  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 ${cardHover}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-3 select-none text-6xl font-bold text-foreground/5"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-xl text-accent">
        <FiBookOpen aria-hidden="true" />
      </div>

      <h3 className="mt-5 pr-14 text-xl font-bold tracking-tight">{cert.title}</h3>
      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted">
        {cert.issuer}
      </p>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
        <IssuedDate issued={cert.issued} />
        <CredentialLink cert={cert} />
      </div>
    </article>
  );
}

export default function Certifications() {
  const featured = certifications.find((c) => c.featured);
  const others = certifications.filter((c) => c !== featured);

  const stats: { icon: IconType; value: number; label: string }[] = [
    { icon: FiAward, value: certifications.length, label: "Certificates" },
    { icon: FiUsers, value: new Set(certifications.map((c) => c.issuer)).size, label: "Issuers" },
    { icon: FiLayers, value: new Set(certifications.flatMap((c) => c.tags)).size, label: "Topics" },
  ];

  return (
    <section id="certifications" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24">
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          My <span className="text-accent">Certifications</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Courses and credentials I have completed.
        </p>
      </div>

      <ul className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-3 sm:gap-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <li
            key={label}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface/60 px-3 py-5 text-center sm:flex-row sm:justify-center sm:gap-4 sm:text-left"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-lg text-accent">
              <Icon aria-hidden="true" />
            </span>
            <span>
              <span className="block text-2xl font-bold leading-none">{value}</span>
              <span className="mt-1 block text-xs uppercase tracking-widest text-muted">
                {label}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {featured && (
        <div className="mt-10">
          <FeaturedCard cert={featured} />
        </div>
      )}

      {others.length > 0 && (
        <>
          <div className="mt-14 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              {featured ? "Other certifications" : "Certifications"}
            </h3>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div
            className={`mt-8 grid gap-6 ${
              others.length === 1 ? "mx-auto max-w-2xl" : "md:grid-cols-2"
            }`}
          >
            {others.map((cert, index) => (
              <CertCard key={cert.title} cert={cert} index={index} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
