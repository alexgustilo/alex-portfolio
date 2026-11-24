export default function Footer() {
  return (
    <footer className="border-t border-border bg-white py-9">
      <div className="container flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <a href="#home" className="text-xl font-extrabold">
          Alex<span className="text-primary">.</span>
        </a>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Alex Gustilo. All rights reserved.
        </p>

        <a
          href="https://github.com/alexgustilo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-muted-foreground transition hover:text-primary"
        >
          GitHub ↗
        </a>
      </div>
    </footer>
  );
}
