import { RiRobot2Line } from "react-icons/ri";

const links: { href: string; label: string; short?: string }[] = [
  { href: "#about", label: "About" },
  { href: "#certifications", label: "Certifications", short: "Certs" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="text-xl font-bold tracking-tight">
          R<span className="text-accent">.</span>
        </a>
        <ul className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider sm:gap-8 sm:text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-label={link.short ? link.label : undefined}
                className="text-muted transition-colors hover:text-foreground"
              >
                {link.short ? (
                  <>
                    <span className="lg:hidden">{link.short}</span>
                    <span className="hidden lg:inline">{link.label}</span>
                  </>
                ) : (
                  link.label
                )}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#ai"
              className="flex items-center gap-1.5 rounded-md border border-accent/40 px-2 py-1 text-accent transition-colors hover:bg-accent/10"
            >
              <RiRobot2Line className="text-base" aria-hidden="true" />
              Ask AI
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
