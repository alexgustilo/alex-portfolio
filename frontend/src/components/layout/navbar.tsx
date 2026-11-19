
"use client";

import { useState } from "react";

const navigation = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certificates", href: "#certificates" },
  { label: "Journey", href: "#journey" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-xl">
      <nav
        className="container flex h-20 items-center justify-between"
        aria-label="Main navigation"
      >
        <a
          href="#home"
          className="text-2xl font-extrabold tracking-tight"
          onClick={() => setMenuOpen(false)}
        >
          Alex<span className="text-primary">.</span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-primary"
            >
              {item.label}
            </a>
          ))}

          <a
            href="#contact"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Let’s Talk ↗
          </a>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-border lg:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`h-0.5 w-5 bg-foreground transition ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-foreground transition ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-foreground transition ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-border bg-white px-5 py-5 shadow-lg lg:hidden">
          <div className="container flex flex-col gap-5">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-medium text-foreground transition hover:text-primary"
              >
                {item.label}
              </a>
            ))}

            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-primary px-6 py-3 text-center font-semibold text-white"
            >
              Let’s Talk ↗
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
