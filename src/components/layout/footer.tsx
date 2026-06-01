import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { MapPin, Phone, Mail } from "lucide-react";
import { SOCIAL_LINKS } from "@/components/shared/social-links";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-zinc-950 text-white">
      <div className="container mx-auto px-4 lg:px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Col 1 — Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5" aria-label="IDLOGICE home">
              <Image src="/logo.png" alt="IDLOGICE" width={200} height={60}
                className="h-[54px] w-auto object-contain brightness-0 invert" unoptimized />
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-xs">{t("tagline")}</p>
            <div className="flex gap-2 text-base" aria-label="Social media links">
              {SOCIAL_LINKS.map(({ svg, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-primary hover:border-primary transition-all">
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Useful Links */}
          <div>
            <p className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">{t("usefulLinks")}</p>
            <ul className="space-y-2.5">
              {[
                { href: "/",        label: t("home")        },
                { href: "/about",   label: t("about")       },
                { href: "/services",label: t("services")    },
                { href: "/from",         label: "Immigrate by Country" },
                { href: "/in",           label: "Immigration by City" },
                { href: "/province",     label: "Province Programs (PNP)" },
                { href: "/for",          label: "Immigration by Profession" },
                { href: "/programs",     label: "Immigration Programs" },
                { href: "/guides/canada-immigration", label: "Immigration Guide" },
                { href: "/faq",          label: "FAQ"              },
                { href: "/glossary",     label: "Immigration Glossary" },
                { href: "/testimonials", label: "Success Stories"  },
                { href: "/blog",         label: "Blog"             },
                { href: "/stats",        label: "Immigration Statistics" },
                { href: "/team",         label: "Our Consultants"  },
                { href: "/editorial-standards", label: "Editorial Standards" },
                { href: "/corrections-policy", label: "Corrections Policy" },
                { href: "/official-resources", label: "Official Resources" },
                { href: "/contact",      label: t("contact")      },
                { href: "/privacy", label: t("privacy")     },
                { href: "/terms",   label: t("terms")       },
                { href: "/immigration-disclaimer", label: "Immigration Disclaimer" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div>
            <p className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">{t("services")}</p>
            <ul className="space-y-2.5">
              {[
                { href: "/services/express-entry", label: t("expressEntry") },
                { href: "/services/study-permit",  label: t("studyPermit")  },
                { href: "/services/work-permit",   label: t("workPermit")   },
                { href: "/services/pnp",           label: t("pnp")          },
                { href: "/services/tourist-visa",  label: t("touristVisa")  },
                { href: "/services/pr-pathways",   label: "PR Pathways"     },
                { href: "/services",               label: t("allServices")  },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact + CICC badge */}
          <div>
            <p className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">{t("contactUs")}</p>
            <ul className="space-y-3 mb-8">
              <li>
                <a href="tel:+15816340224"
                  className="flex items-start gap-2.5 text-sm text-zinc-400 hover:text-white transition-colors">
                  <Phone className="size-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  +1 581-634-0224
                </a>
              </li>
              <li>
                <a href="mailto:contact@idlogice.com"
                  className="flex items-start gap-2.5 text-sm text-zinc-400 hover:text-white transition-colors">
                  <Mail className="size-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  contact@idlogice.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-400">
                <MapPin className="size-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <span>410 Saint-Catherine St<br />Montreal, Canada</span>
              </li>
            </ul>
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-8 text-primary shrink-0" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              <div>
                <p className="text-xs font-bold text-white leading-tight">{t("rcicRegulated")}</p>
                <p className="text-xs text-zinc-400 leading-tight">{t("ciccMember")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/8 pt-8 mb-6">
          <p className="text-xs text-zinc-600 leading-relaxed max-w-4xl">{t("disclaimer")}</p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/8 pt-6">
          <p className="text-xs text-zinc-600">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">{t("privacy")}</Link>
            <Link href="/terms"   className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">{t("terms")}</Link>
            <Link href="/cookies" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">{t("cookies")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
