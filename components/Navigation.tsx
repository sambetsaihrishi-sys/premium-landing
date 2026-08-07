const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
];

export default function Navigation() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8">
      <div className="pointer-events-auto flex items-center gap-2">
        <span className="text-sm font-medium tracking-[0.2em] text-paper">
          S. HRISHI
        </span>
      </div>

      <nav className="glass-pill pointer-events-auto hidden items-center gap-8 rounded-full px-6 py-3 sm:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-[13px] font-normal tracking-wide text-paper/80 transition-colors duration-300 hover:text-paper"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <a
        href="#contact"
        className="glass-pill pointer-events-auto rounded-full px-5 py-3 text-[13px] font-medium tracking-wide text-paper transition-transform duration-300 ease-premium hover:scale-[1.04] active:scale-[0.98]"
      >
        Get in Touch
      </a>
    </div>
  );
}
