import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#lead-form" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bark/95 backdrop-blur-sm border-b border-cream/10">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo + Name */}
        <a href="#" className="flex items-center gap-3" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src="/logo.png" alt="Anthony Fischetti Landscaping logo" className="w-9 h-9 rounded" />
          <span className="font-display font-bold text-cream text-lg hidden sm:inline">
            Anthony Fischetti Landscaping
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-cream/80 hover:text-cream transition-colors text-sm font-medium"
            >
              {link.label}
            </button>
          ))}
          <a href="tel:908-347-1192" className="flex items-center gap-2 text-sage text-sm font-bold">
            <Phone className="w-4 h-4" />
            <span className="font-numbers">908-347-1192</span>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-cream p-2"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-bark border-t border-cream/10">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-cream/80 hover:text-cream transition-colors text-left py-2 text-sm font-medium"
              >
                {link.label}
              </button>
            ))}
            <a href="tel:908-347-1192" className="flex items-center gap-2 text-sage py-2 text-sm font-bold">
              <Phone className="w-4 h-4" />
              <span className="font-numbers">908-347-1192</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
