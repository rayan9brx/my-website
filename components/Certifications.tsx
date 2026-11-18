import Image from "next/image";
import type { IconType } from "react-icons";
import {
  FiAward,
  FiArrowUpRight,
  FiBookOpen,
  FiCalendar,
  FiCloud,
  FiCpu,
  FiDatabase,
  FiLayers,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import { SiPython } from "react-icons/si";
import {
  certifications,
  formatList,
  pythonCertifications,
  sortNewestFirst,
  unique,
  type Certification,
  type CertificationCategory,
} from "@/data/certifications";
import CountUp from "./CountUp";
import { PythonPanel, PythonStatButton, PythonToggleProvider } from "./PythonToggle";

const cardHover =
  "transition-all duration-300 hover:border-accent/50 hover:bg-surface motion-safe:hover:-translate-y-1";

// Stat card frame and inner layout, shared by the plain cards and the
// clickable Python card so they look the same.
const statFrame = "rounded-2xl border border-border bg-surface/60 px-3 py-5 text-center";
const statRow =
  "flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4 sm:text-left";

const categoryIcon: Record<CertificationCategory, IconType> = {
  ai: FiCpu,
  cloud: FiCloud,
  data: FiDatabase,
  python: SiPython,
};

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

function Divider({ label }: { label: string }) {
  return (
    <div className="mt-14 flex items-center gap-4">
      <span className="h-px flex-1 bg-border" />
      <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">{label}</h3>
      <span className="h-px flex-1 bg-border" />
    </div>
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
          {cert.description && (
            <p className="mt-4 leading-relaxed text-foreground/80">{cert.description}</p>
          )}

          {cert.tags && cert.tags.length > 0 && (
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
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <IssuedDate issued={cert.issued} />
            <CredentialLink cert={cert} />
          </div>
        </div>
      </div>
    </article>
  );
}

function CertCard({
  cert,
  index,
  className = "",
}: {
  cert: Certification;
  index: number;
  className?: string;
}) {
  const Icon = cert.category ? categoryIcon[cert.category] : FiBookOpen;
  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 ${cardHover} ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-3 select-none text-6xl font-bold text-foreground/5"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-xl text-accent">
        <Icon aria-hidden="true" />
      </div>

      <h3 className="mt-5 pr-14 text-xl font-bold tracking-tight">{cert.title}</h3>
      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted">
        {cert.issuer}
      </p>
      {cert.description && (
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">{cert.description}</p>
      )}

      {/* mt-auto pins the footer to the bottom so cards with and without a
          description line up in the same row. */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <IssuedDate issued={cert.issued} />
        <CredentialLink cert={cert} />
      </div>
    </article>
  );
}

function PythonCard({ courses }: { courses: Certification[] }) {
  const issuers = unique(courses.map((c) => c.issuer));
  return (
    <article
      className={`relative overflow-hidden rounded-3xl border border-border bg-surface/60 p-6 sm:p-8 ${cardHover}`}
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-10 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-10">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/40 bg-accent/10 text-3xl text-accent">
            <SiPython aria-hidden="true" />
          </span>
          <p className="mt-5 text-7xl font-bold leading-none tracking-tight text-accent">
            <CountUp value={courses.length} />
          </p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.25em]">
            Python courses
          </p>
          <p className="mt-3 text-sm text-muted">From {formatList(issuers)}</p>
        </div>

        <ul className="grid content-start gap-3 sm:grid-cols-2">
          {courses.map((course) => (
            <li
              key={course.title}
              className="group/item flex flex-col rounded-xl border border-border bg-background/40 px-4 py-3 transition-colors hover:border-accent/40 hover:bg-accent/5"
            >
              <p className="text-sm font-semibold leading-snug transition-colors group-hover/item:text-accent">
                {course.credentialUrl ? (
                  <a
                    href={course.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1 hover:underline"
                  >
                    {course.title}
                    <FiArrowUpRight aria-hidden="true" className="mt-0.5 shrink-0" />
                    <span className="sr-only">(view credential, opens in a new tab)</span>
                  </a>
                ) : (
                  course.title
                )}
              </p>
              <p className="mt-1 text-xs text-muted">
                <span className="uppercase tracking-wider">{course.issuer}</span>
                <span aria-hidden="true"> · </span>
                {course.issued}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Certifications() {
  const featured = certifications.find((c) => c.featured);
  const others = sortNewestFirst(
    certifications.filter((c) => c !== featured && c.category !== "python"),
  );
  const oddCount = others.length % 2 === 1;

  const hasPython = pythonCertifications.length > 0;

  const stats: { icon: IconType; value: number; label: string; togglesPython?: boolean }[] = [
    { icon: FiAward, value: certifications.length, label: "Certificates" },
    {
      icon: SiPython,
      value: pythonCertifications.length,
      label: "Python courses",
      togglesPython: hasPython,
    },
    { icon: FiUsers, value: unique(certifications.map((c) => c.issuer)).length, label: "Issuers" },
    {
      icon: FiLayers,
      value: unique(certifications.flatMap((c) => c.tags ?? [])).length,
      label: "Topics",
    },
  ];

  return (
    <section id="certifications" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24">
      <PythonToggleProvider>
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          My <span className="text-accent">Certifications</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Courses and credentials I have completed.
        </p>
      </div>

      <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {stats.map(({ icon: Icon, value, label, togglesPython }) => {
          const content = (
            <>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-lg text-accent">
                <Icon aria-hidden="true" />
              </span>
              <span>
                <span className="block text-2xl font-bold leading-none">
                  <CountUp value={value} />
                </span>
                <span className="mt-1 block text-xs uppercase tracking-widest text-muted">
                  {label}
                </span>
              </span>
            </>
          );

          if (togglesPython) {
            return (
              <li key={label} className="flex">
                <PythonStatButton className={statFrame}>
                  <span className={statRow}>{content}</span>
                </PythonStatButton>
              </li>
            );
          }

          return (
            <li key={label} className={`${statFrame} ${statRow}`}>
              {content}
            </li>
          );
        })}
      </ul>

      {/* Opens directly under the stats row, where the Python card is clicked. */}
      {hasPython && (
        <PythonPanel label="Python courses">
          <div className="pt-6">
            <PythonCard courses={pythonCertifications} />
          </div>
        </PythonPanel>
      )}

      {featured && (
        <div className="mt-10">
          <FeaturedCard cert={featured} />
        </div>
      )}

      {others.length > 0 && (
        <>
          <Divider label={featured ? "Other certifications" : "Certifications"} />

          {/* One card: centered at half width. Odd count: the last card spans
              both columns and is centered at the width of one column. */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {others.map((cert, index) => {
              const isLastOdd = oddCount && index === others.length - 1;
              return (
                <CertCard
                  key={cert.title}
                  cert={cert}
                  index={index}
                  className={
                    isLastOdd ? "md:col-span-2 md:mx-auto md:w-[calc((100%-1.5rem)/2)]" : ""
                  }
                />
              );
            })}
          </div>
        </>
      )}

      </PythonToggleProvider>
    </section>
  );
}
