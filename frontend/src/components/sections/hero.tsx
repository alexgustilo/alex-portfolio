export default function Hero() {
  return (
    <section className="relative flex min-h-[78vh] items-center overflow-hidden">
      <div className="container relative z-10 py-24">
        <p className="mb-6 inline-flex rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium text-primary">
          Welcome to my portfolio
        </p>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Hi, I&apos;m Alex.
          <br />
          I build{" "}
          <span className="gradient-text">
            digital experiences.
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          I&apos;m a BSIT student and aspiring software developer passionate
          about creating modern, useful, and meaningful web applications.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded-full bg-primary px-7 py-3.5 font-semibold text-white transition hover:bg-primary-hover"
          >
            Explore My Work
          </a>

          <a
            href="#contact"
            className="rounded-full border border-border px-7 py-3.5 font-semibold transition hover:border-primary hover:text-primary"
          >
            Contact Me
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-200/40 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-blue-200/40 blur-[120px]" />
    </section>
  );
}
