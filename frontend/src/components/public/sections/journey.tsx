import SectionHeading from "@/components/shared/section-heading";
import { journey } from "@/lib/data";

export default function Journey() {
  return (
    <section id="journey" className="section-padding">
      <div className="container">
        <SectionHeading
          label="05 / MY JOURNEY"
          title="A journey of continuous growth."
          description="Every project and learning experience helps me move closer to my goals."
        />

        <div className="mt-12 max-w-3xl space-y-10">
          {journey.map((item) => (
            <article
              key={item.title}
              className="relative border-l-2 border-primary/30 pb-2 pl-8"
            >
              <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-4 border-white bg-primary" />
              <p className="text-sm font-bold uppercase tracking-wider text-primary">
                {item.period}
              </p>
              <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
