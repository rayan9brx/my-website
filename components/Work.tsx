import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { MdNorthEast } from "react-icons/md";
import { HiOutlineCodeBracket } from "react-icons/hi2";
import { projects, type Project } from "@/data/projects";
import WorkShowcase from "@/components/WorkShowcase";

/** True when the image file exists in public/, so a missing file never shows a broken image. */
function imageExists(src: string | undefined): src is string {
  if (!src) return false;
  return existsSync(path.join(process.cwd(), "public", src));
}

function ProjectLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-medium underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent focus-visible:text-accent"
    >
      {label}
      <MdNorthEast aria-hidden className="text-sm" />
    </a>
  );
}

function Screenshot({ project, number, eager }: { project: Project; number: string; eager: boolean }) {
  if (imageExists(project.image)) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)]">
        <Image
          src={project.image}
          alt={`Screenshot of ${project.title}, ${project.type.toLowerCase()}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 60vw, 85vw"
          loading={eager ? "eager" : "lazy"}
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-surface shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:28px_28px] opacity-60" />
      <div className="relative flex flex-col items-center gap-2 text-accent/70">
        <HiOutlineCodeBracket className="text-4xl" />
        <span className="font-mono text-sm tracking-widest">{number}</span>
      </div>
    </div>
  );
}

function ProjectColumn({ project, index }: { project: Project; index: number }) {
  const number = String(index + 1).padStart(2, "0");
  const headingId = `project-${index + 1}-title`;
  // Odd columns (01, 03, 05): text on top. Even columns: screenshot on top.
  const textFirst = index % 2 === 0;

  return (
    <article
      aria-labelledby={headingId}
      data-project
      className={`flex w-[85vw] shrink-0 snap-start gap-8 border-r border-border px-6 py-8 sm:w-[60vw] lg:w-[33.333vw] lg:px-8 lg:py-6 ${
        textFirst ? "flex-col" : "flex-col-reverse"
      }`}
    >
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <span aria-hidden className="text-5xl font-bold leading-none text-accent/25 lg:text-6xl">
            {number}
          </span>
          <div className="text-right">
            <h3 id={headingId} className="text-xl font-bold tracking-tight lg:text-2xl">
              {project.title}
            </h3>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted">{project.type}</p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-foreground/80">{project.description}</p>

        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">
          Tools and features
        </p>
        <p className="mt-1 text-sm text-muted">{project.tools.join(", ")}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border px-4 py-2.5 text-sm">
          <span className="text-muted">Project:</span>
          {project.github && <ProjectLink href={project.github} label="GitHub" />}
          {project.live && <ProjectLink href={project.live} label="Live" />}
          {!project.github && !project.live && <span className="text-muted">Links coming soon</span>}
        </div>
      </div>

      {/* Auto margins center the screenshot in the space the text leaves free. */}
      <div className="w-full lg:my-auto lg:w-[min(100%,calc(30vh*16/9))]">
        <Screenshot project={project} number={number} eager={index < 2} />
      </div>
    </article>
  );
}

export default function Work() {
  return (
    <WorkShowcase
      count={projects.length}
      heading={
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          My <span className="text-accent">Projects</span>
        </h2>
      }
    >
      {projects.map((project, index) => (
        <ProjectColumn key={project.title} project={project} index={index} />
      ))}
    </WorkShowcase>
  );
}
