import { techStack } from "@/data/techStack";

export default function TechStack() {
  return (
    <section id="tech" className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          My Tech <span className="text-accent">Stack</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Technologies and tools I use to build web applications and AI-powered
          projects.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {techStack.map(({ name, category, icon: Icon }) => (
          <div
            key={name}
            className="group flex items-center gap-4 rounded-xl border border-border bg-surface/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-surface"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/5 text-2xl text-accent transition-colors group-hover:bg-accent/10">
              <Icon />
            </div>
            <div>
              <p className="font-semibold">{name}</p>
              <p className="text-xs uppercase tracking-wider text-muted">
                {category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}