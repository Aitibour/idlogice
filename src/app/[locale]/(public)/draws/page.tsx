import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CrsTrendChart } from "@/components/draws/CrsTrendChart";
import { CtaBanner } from "@/components/sections/cta-banner";
import { TrendingDown, TrendingUp, Users, Calendar, RefreshCw } from "lucide-react";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "draws" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generatePageAlternates(locale, "/draws"),
  };
}

type IrccRound = {
  drawNumber: string;
  drawDate: string;
  drawDateFull: string;
  drawName: string;
  drawSize: string;
  drawCRS: string;
  drawDateTime: string;
  drawCutOff: string;
};

function classifyProgram(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("french")) return "French";
  if (n.includes("provincial") || n.includes("pnp")) return "PNP";
  if (n.includes("experience")) return "CEC";
  if (n.includes("skilled worker")) return "FSW";
  if (n.includes("skilled trades")) return "FST";
  if (n.includes("stem")) return "STEM";
  if (n.includes("health")) return "Healthcare";
  if (n.includes("agri")) return "Agriculture";
  if (n.includes("transport")) return "Transport";
  if (n.includes("trade occupations")) return "Trade";
  if (n.includes("no program")) return "General";
  return "Other";
}

const PROGRAM_COLORS: Record<string, string> = {
  CEC: "bg-emerald-100 text-emerald-700",
  FSW: "bg-amber-100 text-amber-700",
  FST: "bg-orange-100 text-orange-700",
  PNP: "bg-cyan-100 text-cyan-700",
  French: "bg-violet-100 text-violet-700",
  General: "bg-red-100 text-red-700",
  STEM: "bg-blue-100 text-blue-700",
  Healthcare: "bg-pink-100 text-pink-700",
  Agriculture: "bg-lime-100 text-lime-700",
  Trade: "bg-yellow-100 text-yellow-700",
  Transport: "bg-sky-100 text-sky-700",
  Other: "bg-gray-100 text-gray-600",
};

async function fetchDraws(locale: string): Promise<IrccRound[]> {
  const lang = locale === "fr" ? "fr" : "en";
  const url = `https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_${lang}.json`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`IRCC fetch failed: ${res.status}`);
    const data = await res.json();
    return data.rounds as IrccRound[];
  } catch {
    return [];
  }
}

export default async function DrawsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "draws" });

  const rounds = await fetchDraws(locale);
  const latest = rounds[0];
  const recent = rounds.slice(0, 20);

  // Chart: last 20 non-PNP draws for a meaningful CRS trend
  const chartPoints = rounds
    .filter((r) => classifyProgram(r.drawName) !== "PNP")
    .slice(0, 20)
    .reverse()
    .map((r) => ({
      label: `#${r.drawNumber}`,
      crs: parseInt(r.drawCRS, 10),
      program: r.drawName,
    }));

  const prevNonPnp = rounds.filter((r) => classifyProgram(r.drawName) !== "PNP");
  const crsDelta =
    prevNonPnp.length >= 2
      ? parseInt(prevNonPnp[0].drawCRS, 10) - parseInt(prevNonPnp[1].drawCRS, 10)
      : 0;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary/80 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary-foreground/70 bg-white/10 px-3 py-1 rounded-full mb-4">
            <RefreshCw className="size-3" />
            {t("hero.badge")}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">{t("hero.title")}</h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl">{t("hero.subtitle")}</p>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 py-10 space-y-10">
        {/* Latest draw stats */}
        {latest && (
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              {t("latestDraw")} â€” {t("drawNumber")}{latest.drawNumber}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  icon: Calendar,
                  label: t("drawDate"),
                  value: latest.drawDateFull,
                  sub: null,
                },
                {
                  icon: crsDelta >= 0 ? TrendingUp : TrendingDown,
                  label: t("crsScore"),
                  value: latest.drawCRS,
                  sub: crsDelta !== 0 ? `${crsDelta > 0 ? "+" : ""}${crsDelta} vs prev` : null,
                  accent: crsDelta > 0 ? "text-red-600" : crsDelta < 0 ? "text-green-600" : "",
                },
                {
                  icon: Users,
                  label: t("invitations"),
                  value: latest.drawSize,
                  sub: null,
                },
                {
                  icon: Calendar,
                  label: t("program"),
                  value: latest.drawName,
                  sub: null,
                  small: true,
                },
              ].map(({ icon: Icon, label, value, sub, accent, small }) => (
                <div key={label} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon className="size-3.5 text-primary" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </span>
                  </div>
                  <p className={`font-black leading-tight ${small ? "text-sm" : "text-2xl"} ${accent ?? ""}`}>
                    {value}
                  </p>
                  {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CRS trend chart */}
        {chartPoints.length > 1 && (
          <CrsTrendChart
            points={chartPoints}
            title={t("chart.title")}
            subtitle={t("chart.subtitle")}
          />
        )}

        {/* Draws table */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            {t("table.title")}
          </p>
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    {[t("table.draw"), t("table.date"), t("table.program"), t("table.crs"), t("table.invitations")].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recent.map((r, i) => {
                    const prog = classifyProgram(r.drawName);
                    const colorCls = PROGRAM_COLORS[prog] ?? PROGRAM_COLORS.Other;
                    return (
                      <tr key={r.drawNumber} className={i === 0 ? "bg-primary/5" : "hover:bg-gray-50 transition-colors"}>
                        <td className="px-4 py-3 font-mono font-bold text-foreground">
                          #{r.drawNumber}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {r.drawDateFull}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${colorCls}`}>
                            {t(`programs.${prog}` as Parameters<typeof t>[0])}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-black text-foreground">{r.drawCRS}</td>
                        <td className="px-4 py-3 text-muted-foreground">{r.drawSize}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground text-right">{t("source")}</p>
        </section>

        {/* CTA */}
        <CtaBanner
          title={t("cta.title")}
          subtitle={t("cta.subtitle")}
          primaryCta={{ label: t("cta.primary"), href: "/calculator" }}
          secondaryCta={{ label: t("cta.secondary"), href: "/book-consultation" }}
        />
      </div>
    </>
  );
}

