"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { SOCIAL_LINKS } from "@/components/shared/social-links";
import { Menu, X, ChevronDown, Phone } from "lucide-react";

const NAV_TEXT_STYLE = { color: "#111827" } as const;        // gray-900, immune to CSS cascade
const NAV_SUB_TEXT_STYLE = { color: "#1f2937" } as const;    // gray-800

export function Header() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function closeMobile() {
    setMobileOpen(false);
    setServicesOpen(false); // L3 fix: reset sub-menu when closing
  }

  const serviceLinks = [
    { href: "/services/express-entry" as const, label: t("servicesItems.expressEntry") },
    { href: "/services/study-permit"  as const, label: t("servicesItems.studyPermit")  },
    { href: "/services/work-permit"   as const, label: t("servicesItems.workPermit")   },
    { href: "/services/pnp"           as const, label: t("servicesItems.pnp")           },
    { href: "/services/tourist-visa"  as const, label: t("servicesItems.touristVisa")   },
  ];

  const navLinksBefore = [
    { href: "/" as const, label: t("home") },
  ];
  const navLinksAfter = [
    { href: "/about"   as const, label: t("about")   },
    { href: "/contact" as const, label: t("contact") },
    { href: "/jobs"    as const, label: t("jobs")    },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white transition-shadow duration-300",
        scrolled ? "shadow-md" : "border-b border-border/40",
      )}
    >
      <div className="container mx-auto flex h-[70px] items-center justify-between px-4 lg:px-6 gap-4">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo.png" alt="IDLOGICE" width={200} height={60}
            className="logo h-[58px] w-auto object-contain" priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0" aria-label="Main navigation">
          {navLinksBefore.map((link) => (
            <Link key={link.href} href={link.href}
              className="px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
              style={NAV_TEXT_STYLE}>
              {link.label}
            </Link>
          ))}

          {/* Services dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setDesktopServicesOpen(true)}
            onMouseLeave={() => setDesktopServicesOpen(false)}
          >
            <button
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
              style={NAV_TEXT_STYLE}
              aria-haspopup="menu"
              aria-expanded={desktopServicesOpen}
            >
              {t("services")}
              <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180" aria-hidden="true" />
            </button>
            <div className="absolute left-0 top-full pt-3 hidden group-hover:block group-focus-within:block" role="menu">
              <div className="w-52 rounded-xl border border-border/60 bg-white shadow-xl shadow-black/8 p-1.5">
                {serviceLinks.map((link) => (
                  <Link key={link.href} href={link.href} role="menuitem"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted/60 transition-colors"
                    style={NAV_SUB_TEXT_STYLE}>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {navLinksAfter.map((link) => (
            <Link key={link.href} href={link.href}
              className="px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
              style={NAV_TEXT_STYLE}>
              {link.label}
            </Link>
          ))}

        </nav>

        {/* Right: book consultation + divider + social + lang */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/book-consultation"
            className="px-4 py-2 text-sm font-semibold rounded-full bg-primary text-white hover:bg-primary/90 transition-colors whitespace-nowrap">
            {t("bookConsultationNav")}
          </Link>
          <div className="w-px h-5 bg-border" aria-hidden="true" />
          <div className="flex items-center gap-1 text-base" aria-label="Social media links">
            {SOCIAL_LINKS.map(({ label, href, svg }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                style={{ color: "#374151" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-primary, #c2272d)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#374151"; }}>
                {svg}
              </a>
            ))}
          </div>
          <div className="w-px h-5 bg-border" aria-hidden="true" />
          <LanguageSwitcher />
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center bg-muted/60 hover:bg-muted transition-colors"
          onClick={() => (mobileOpen ? closeMobile() : setMobileOpen(true))}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/40 bg-white">
          <nav className="flex flex-col p-3 gap-0.5" aria-label="Mobile navigation">
            {navLinksBefore.map((link) => (
              <Link key={link.href} href={link.href}
                className="px-4 py-3 text-sm font-medium hover:bg-muted/60 rounded-xl transition-colors"
                style={NAV_TEXT_STYLE}
                onClick={closeMobile}>
                {link.label}
              </Link>
            ))}

            <button
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium hover:bg-muted/60 rounded-xl transition-colors"
              style={NAV_TEXT_STYLE}
              onClick={() => setServicesOpen(!servicesOpen)}
              aria-expanded={servicesOpen}
            >
              {t("services")}
              <ChevronDown className={cn("size-4 transition-transform", servicesOpen && "rotate-180")} aria-hidden="true" />
            </button>
            {servicesOpen && (
              <div className="ml-4 flex flex-col gap-0.5">
                {serviceLinks.map((link) => (
                  <Link key={link.href} href={link.href}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted/60 rounded-xl transition-colors"
                    style={NAV_SUB_TEXT_STYLE}
                    onClick={closeMobile}>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {navLinksAfter.map((link) => (
              <Link key={link.href} href={link.href}
                className="px-4 py-3 text-sm font-medium hover:bg-muted/60 rounded-xl transition-colors"
                style={NAV_TEXT_STYLE}
                onClick={closeMobile}>
                {link.label}
              </Link>
            ))}

            <div className="pt-3 mt-1 border-t border-border/40 flex flex-col gap-2">
              <Link href="/contact"
                className={cn(buttonVariants(), "w-full justify-center rounded-xl font-semibold")}
                onClick={closeMobile}>
                {t("bookConsultation")}
              </Link>
              <a href="tel:+15816340224"
                className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="size-4" aria-hidden="true" />
                +1 581-634-0224
              </a>
              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
