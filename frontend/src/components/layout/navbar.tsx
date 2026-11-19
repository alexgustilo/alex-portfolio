const navigation = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-xl">
      <nav className="container flex h-20 items-center justify-between">
        <a href="#" className="text-2xl font-bold tracking-tight">
          Alex<span className="text-primary">.</span>
        </a>

        <div className="flex items-center gap-5 sm:gap-8">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-gray-600 transition hover:text-primary"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover sm:inline-flex"
          >
            Let&apos;s Talk
          </a>
        </div>
      </nav>
    </header>
  );
}
