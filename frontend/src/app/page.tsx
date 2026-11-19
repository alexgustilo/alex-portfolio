import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <section id="about" className="border-t border-border py-24">
          <div className="container">
            <p className="mb-3 font-semibold text-primary">01 / ABOUT</p>
            <h2 className="text-4xl font-bold tracking-tight">
              A little about me.
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
              I&apos;m continuously learning and building my skills in software
              development, frontend engineering, and backend technologies.
            </p>
          </div>
        </section>

        <section id="projects" className="bg-muted py-24">
          <div className="container">
            <p className="mb-3 font-semibold text-primary">02 / PROJECTS</p>
            <h2 className="text-4xl font-bold tracking-tight">
              Things I&apos;ve built.
            </h2>
            <p className="mt-5 max-w-2xl text-muted-foreground">
              My projects and development experiments will be showcased here.
            </p>
          </div>
        </section>

        <section id="contact" className="py-24">
          <div className="container">
            <p className="mb-3 font-semibold text-primary">03 / CONTACT</p>
            <h2 className="text-4xl font-bold tracking-tight">
              Let&apos;s work together.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Have a project or opportunity in mind? Let&apos;s connect.
            </p>
            <a
              href="mailto:your-email@example.com"
              className="mt-7 inline-flex rounded-full bg-primary px-7 py-3 text-white transition hover:bg-primary-hover"
            >
              Send me an email
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container text-sm text-muted-foreground">
          © {new Date().getFullYear()} Alex Gustilo. All rights reserved.
        </div>
      </footer>
    </>
  );
}
