"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

function FlagCA({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden="true">
      <rect width="20" height="14" fill="#fff" />
      <rect width="5" height="14" fill="#D52B1E" />
      <rect x="15" width="5" height="14" fill="#D52B1E" />
      <path
        d="M10 2.5 L10.8 5.2 L13.5 4.5 L12 6.5 L14 7 L11.5 7.8 L12 10 L10 8.8 L8 10 L8.5 7.8 L6 7 L8 6.5 L6.5 4.5 L9.2 5.2 Z"
        fill="#D52B1E"
      />
      <rect x="9.4" y="10" width="1.2" height="1.5" fill="#D52B1E" />
    </svg>
  );
}

function FlagFR({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden="true">
      <rect width="7" height="14" fill="#002395" />
      <rect x="7" width="6" height="14" fill="#fff" />
      <rect x="13" width="7" height="14" fill="#ED2939" />
    </svg>
  );
}

function FlagES({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden="true">
      <rect width="20" height="14" fill="#AA151B" />
      <rect y="3.5" width="20" height="7" fill="#F1BF00" />
    </svg>
  );
}

function FlagAR({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden="true">
      <rect width="20" height="4.67" fill="#007A3D" />
      <rect y="4.67" width="20" height="4.67" fill="#fff" />
      <rect y="9.33" width="20" height="4.67" fill="#CE1126" />
    </svg>
  );
}

const FLAGS: Record<Locale, React.ComponentType<{ className?: string }>> = {
  en: FlagCA,
  fr: FlagFR,
  es: FlagES,
  ar: FlagAR,
};

const LABELS: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  es: "ES",
  ar: "AR",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function switchTo(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  }

  const ActiveFlag = FLAGS[locale] ?? FLAGS.en;

  return (
    <div ref={ref} className="relative" aria-label="Language switcher">
      {/* Trigger: current flag + label + chevron */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted/60 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <ActiveFlag className="w-5 h-3.5 rounded-[2px] shrink-0" />
        <span className="text-xs font-semibold uppercase" style={{ color: "#374151" }}>{LABELS[locale] ?? "EN"}</span>
        <ChevronDown className={cn("size-3 transition-transform", open && "rotate-180")} style={{ color: "#374151" }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-border bg-white shadow-lg shadow-black/8 py-1 z-50"
          role="listbox"
        >
          {locales.map((loc) => {
            const Flag = FLAGS[loc];
            const isActive = locale === loc;
            return (
              <button
                key={loc}
                role="option"
                aria-selected={isActive}
                onClick={() => switchTo(loc)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                  isActive ? "bg-primary/8 text-primary font-semibold" : "hover:bg-muted/60"
                )}
                style={isActive ? undefined : { color: "#111827" }}
              >
                <Flag className="w-5 h-3.5 rounded-[2px] shrink-0" />
                <span>{localeNames[loc]}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
