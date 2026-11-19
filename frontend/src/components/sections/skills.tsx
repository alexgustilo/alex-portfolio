import SectionHeading from "@/components/shared/section-heading";
import { skillGroups } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="section-padding bg-muted">
      <div className="container">
        <SectionHeading
          label="02 / MY SKILLS"
          title="Technologies I work with."
          description="Tools and technologies I have explored and used throughout my development journey."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <article key={group.category} className="portfolio-card p-7">
              <h3 className="text-lg font-bold">{group.category}</h3>
              <div className="mt-6 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-border bg-muted px-3 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
