
export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[85vh] items-center overflow-hidden"
    >
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-200/40 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-blue-200/40 blur-[120px]" />

      <div className="container relative z-10 grid items-center gap-16 py-24 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-purple-50 px-4 py-2 text-sm font-semibold text-primary">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Welcome to my portfolio
          </p>

          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
            Hi, I’m Alex.
            <br />
            A future{" "}
            <span className="gradient-text">
              Full-Stack Developer.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            I’m an Information Technology student passionate about
            building modern web applications, exploring new technologies,
            and turning creative ideas into useful digital experiences.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-full bg-primary px-8 py-4 font-semibold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-1 hover:bg-primary-hover"
            >
              Explore My Work ↗
            </a>

            <a
              href="#contact"
              className="rounded-full border border-border bg-white px-8 py-4 font-semibold transition hover:-translate-y-1 hover:border-primary hover:text-primary"
            >
              Contact Me
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <a
              href="https://github.com/alexgustilo"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition hover:text-primary"
            >
              GitHub ↗
            </a>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>Based in the Philippines</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-5 rounded-[40px] bg-gradient-to-br from-purple-200 to-blue-200 opacity-60 blur-2xl" />

          <div className="relative rounded-[32px] border border-white bg-white p-4 shadow-2xl shadow-purple-100">
            <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-[24px] bg-gradient-to-br from-purple-100 via-white to-blue-100">
              <div className="flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-5xl font-extrabold text-white shadow-xl shadow-purple-200">
                AG
              </div>

              <h2 className="mt-7 text-2xl font-bold">Alex Gustilo</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Aspiring Full-Stack Developer
              </p>

              <div className="mt-7 rounded-full border border-primary/20 bg-white/80 px-5 py-2 text-xs font-semibold text-primary">
                Always Learning & Building
              </div>
            </div>

            <div className="px-3 py-4 text-center text-xs text-muted-foreground">
              Passionate about technology and innovation.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
