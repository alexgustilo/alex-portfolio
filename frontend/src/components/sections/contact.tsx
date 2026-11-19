export default function Contact() {
  return (
    <section id="contact" className="section-padding bg-muted">
      <div className="container">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#6d5ce7] to-[#3978e8] px-7 py-16 text-white shadow-xl shadow-purple-200 sm:px-14 sm:py-20">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/20" />
          <div className="pointer-events-none absolute -bottom-32 -right-10 h-80 w-80 rounded-full border border-white/20" />

          <div className="relative z-10 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-white/75">
              06 / CONTACT
            </p>

            <h2 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Let’s create something meaningful.
            </h2>

            <p className="mt-6 leading-8 text-white/80">
              Interested in collaborating, discussing opportunities,
              or connecting about technology? I’d be happy to hear from you.
            </p>

            <a
              href="mailto:your-email@example.com"
              className="mt-9 inline-flex rounded-full bg-white px-8 py-4 font-bold text-[#6d5ce7] transition hover:-translate-y-1 hover:bg-purple-50"
            >
              Get in Touch ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
