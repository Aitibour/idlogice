import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{t("company")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{t("tools")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/calculator"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("calculator")}
                </Link>
              </li>
              <li>
                <Link
                  href="/evaluation"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("evaluation")}
                </Link>
              </li>
              <li>
                <Link
                  href="/draws"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("drawTracker")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{t("resources")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("blog")}
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("help")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{t("legal")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("cookies")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Immigration Disclaimer */}
        <div className="border-t pt-8 mb-8">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-4xl">
            {t("disclaimer")}
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {t("copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
