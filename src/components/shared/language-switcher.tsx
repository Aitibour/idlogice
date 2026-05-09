"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

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

const FLAGS: Record<Locale, React.ComponentType<{ className?: string }>> = {
  en: FlagCA,
  fr: FlagFR,
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1" aria-label="Language switcher">
      {locales.map((loc) => {
        const Flag = FLAGS[loc];
        return (
          <button
            key={loc}
            onClick={() => switchTo(loc)}
            aria-label={loc === "en" ? "English" : "Français"}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold transition-colors",
              locale === loc
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary",
            )}
          >
            <Flag className="w-5 h-3.5 rounded-[2px] shrink-0" />
            <span className="uppercase tracking-wide">{loc}</span>
          </button>
        );
      })}
    </div>
  );
}
