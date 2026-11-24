import SectionHeading from "@/components/shared/section-heading";
import { certificates } from "@/lib/data";

export default function Certificates() {
  return (
    <section id="certificates" className="section-padding bg-muted">
      <div className="container">
        <SectionHeading
          label="04 / CERTIFICATES"
          title="Learning and achievements."
          description="Recognition and milestones from my continuous learning journey."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <article key={certificate.name} className="portfolio-card p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-xl font-bold text-primary">
                ✓
              </div>

              <p className="mt-7 text-sm font-semibold text-primary">
                {certificate.date}
              </p>
              <h3 className="mt-3 text-lg font-bold leading-relaxed">
                {certificate.name}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {certificate.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
