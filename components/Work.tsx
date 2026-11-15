import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Selected <span className="text-accent">Work</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Projects I&apos;ve built and shipped.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}