import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col rounded-xl border border-border bg-surface/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-surface">
      <h3 className="text-xl font-bold tracking-tight">{project.title}</h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">
        {project.description}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
          >
            {tag}
          </li>
        ))}
      </ul>

      {(project.github || project.live) && (
        <div className="mt-6 flex gap-5 text-sm font-semibold uppercase tracking-wider">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-foreground"
            >
              GitHub ↗
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-foreground"
            >
              Live ↗
            </a>
          )}
        </div>
      )}
    </article>
  );
}