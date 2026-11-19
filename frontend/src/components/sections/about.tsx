export default function About() {
  return (
    <section id="about" className="section-padding border-t border-border">
      <div className="container grid gap-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="section-label">01 / ABOUT ME</p>
          <h2 className="section-title">
            Turning curiosity into{" "}
            <span className="gradient-text">creation.</span>
          </h2>
        </div>

        <div className="space-y-5 leading-8 text-muted-foreground">
          <p>
            I’m an Information Technology student with a growing passion
            for software development and technology.
          </p>
          <p>
            I enjoy exploring programming languages, developing web
            applications, solving problems, and learning how technology
            can create meaningful solutions.
          </p>
          <p>
            My goal is to become a skilled full-stack developer by
            continuously building projects and improving my technical
            and problem-solving abilities.
          </p>
        </div>
      </div>
    </section>
  );
}
