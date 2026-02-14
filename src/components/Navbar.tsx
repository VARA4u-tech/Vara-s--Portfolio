import { useState } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Technical Skill", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-6 bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-center gap-0">
          {links.map((link, i) => (
            <span key={link.href} className="flex items-center">
              <a href={link.href} className="nav-link px-4 py-1">
                {link.label}
              </a>
              {i < links.length - 1 && (
                <span className="text-foreground/20 text-xs">|</span>
              )}
            </span>
          ))}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex justify-center">
          <button
            onClick={() => setOpen(!open)}
            className="nav-link"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden flex flex-col items-center gap-4 mt-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
