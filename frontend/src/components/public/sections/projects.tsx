import SectionHeading from "@/components/shared/section-heading";
import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section id="projects" className="section-padding">
      <div className="container">
        <SectionHeading
          label="03 / SELECTED WORK"
          title="Projects I have worked on."
          description="A collection of applications and projects that represent my learning and development experience."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project.number} className="portfolio-card overflow-hidden">
              <div className="flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100">
                <span className="text-5xl font-extrabold tracking-widest text-primary/30">
                  {project.number}
                </span>
              </div>

              <div className="p-7 sm:p-9">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {project.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Project {project.number}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-bold">{project.name}</h3>
                <p className="mt-4 leading-7 text-muted-foreground">
                  {project.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full bg-muted px-3 py-2 text-xs font-medium text-muted-foreground"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
