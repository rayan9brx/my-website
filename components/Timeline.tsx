import { timeline } from "@/data/timeline";

export default function Timeline() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="mx-auto max-w-md text-center text-4xl font-bold tracking-tight sm:text-5xl">
        My Education &amp; <span className="text-accent">Experience</span>
      </h2>

      <div className="mt-16">
        {timeline.map((item) => (
          <article
            key={`${item.title}-${item.year}`}
            className="grid gap-4 py-8 md:grid-cols-[1fr_auto_1.3fr] md:items-start md:gap-0"
          >
            {/* Left: role and organization */}
            <div className="md:pr-10">
              <h3 className="text-xl font-bold leading-snug">{item.title}</h3>
              <p className="mt-2 text-sm font-medium text-accent">
                {item.organization}
              </p>
            </div>

            {/* Middle: year */}
            <p className="text-4xl font-bold uppercase tracking-tight md:px-10 md:text-right md:text-5xl">
              {item.year}
            </p>

            {/* Right: description, with the timeline line */}
            <div className="relative md:border-l md:border-white/10 md:pl-10">
              <span className="absolute -left-[5px] top-3 hidden h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(59,130,246,0.8)] md:block" />
              <p className="text-sm leading-relaxed text-foreground/80">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}