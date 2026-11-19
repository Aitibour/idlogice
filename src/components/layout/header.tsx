"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { SOCIAL_LINKS } from "@/components/shared/social-links";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";

const NAV_TEXT_STYLE = { color: "#111827" } as const;        // gray-900, immune to CSS cascade
const NAV_SUB_TEXT_STYLE = { color: "#1f2937" } as const;    // gray-800

export function Header() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);

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
    { href: "/services/family-sponsorship" as const, label: t("servicesItems.familySponsorship") },
  ];

  const navLinksBefore = [
    { href: "/" as const, label: t("home") },
  ];
  const navLinksAfter = [
    { href: "/about"   as const, label: t("about")   },
    { href: "/contact" as const, label: t("contact") },
    { href: "/jobs"    as const, label: t("jobs")    },
    { href: "/draws"   as const, label: t("draws")   },
    { href: "/blog"    as const, label: t("blog")    },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-white shadow-sm"
    >
      <div className="container mx-auto flex min-h-[70px] flex-wrap items-center justify-between px-4 lg:px-6 gap-x-4 gap-y-2 py-2 min-[1800px]:max-w-none">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo.png" alt="IDLOGICE" width={200} height={60}
            className="logo h-[58px] w-auto object-contain" priority unoptimized />
        </Link>

        {/* Desktop nav */}
        <nav className="order-last hidden w-full lg:flex items-center justify-center gap-0 min-[1800px]:order-none min-[1800px]:w-auto" aria-label="Main navigation">
          {navLinksBefore.map((link) => (
            <Link key={link.href} href={link.href}
              className="px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
              style={NAV_TEXT_STYLE}>
              {link.label}
            </Link>
          ))}

          {/* Services dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDesktopServicesOpen(true)}
            onMouseLeave={() => setDesktopServicesOpen(false)}
          >
            <button
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
              style={NAV_TEXT_STYLE}
              aria-haspopup="menu"
              aria-expanded={desktopServicesOpen}
              onClick={() => setDesktopServicesOpen(!desktopServicesOpen)}
            >
              {t("services")}
              <ChevronDown className={cn("size-3.5 transition-transform duration-200", desktopServicesOpen && "rotate-180")} aria-hidden="true" />
            </button>
            {desktopServicesOpen && (
              <div className="absolute left-0 top-full pt-3" role="menu">
                <div className="w-52 rounded-xl border border-border/60 bg-white shadow-xl shadow-black/8 p-1.5">
                  {serviceLinks.map((link) => (
                    <Link key={link.href} href={link.href} role="menuitem"
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted/60 transition-colors"
                      style={NAV_SUB_TEXT_STYLE}
                      onClick={() => setDesktopServicesOpen(false)}>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {navLinksAfter.map((link) => (
            <Link key={link.href} href={link.href}
              className="px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
              style={NAV_TEXT_STYLE}>
              {link.label}
            </Link>
          ))}

        </nav>

        {/* Contact details beside the consultation action. */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex shrink-0 items-center rounded-full border border-gray-200 bg-gray-50/80 p-1 text-sm font-semibold shadow-sm">
            <a href="tel:+12899175372" className="flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full px-3 text-gray-900 transition-colors hover:bg-white hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <Phone className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span dir="ltr">+1 289-917-5372</span>
            </a>
            <span className="mx-1 h-5 w-px bg-gray-200" aria-hidden="true" />
            <a href="mailto:contact@idlogice.com" className="flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full px-3 text-gray-900 transition-colors hover:bg-white hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span dir="ltr">contact@idlogice.com</span>
            </a>
          </div>
          <Link href="/book-consultation"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold whitespace-nowrap text-white shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
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
              <Link href="/book-consultation"
                className={cn(buttonVariants(), "w-full justify-center rounded-xl font-semibold")}
                onClick={closeMobile}>
                {t("bookConsultation")}
              </Link>
              <a href="tel:+12899175372"
                className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="size-4" aria-hidden="true" />
                +1 2899175372
              </a>
              <a href="mailto:contact@idlogice.com"
                className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-gray-900 hover:text-primary">
                <Mail className="size-4" aria-hidden="true" />
                <span dir="ltr">contact@idlogice.com</span>
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



