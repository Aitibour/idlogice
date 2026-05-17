"use client";

type Point = { label: string; crs: number; program: string };

function programColor(name: string): string {
  if (name.toLowerCase().includes("french")) return "#7c3aed";
  if (name.toLowerCase().includes("provincial") || name.toLowerCase().includes("pnp")) return "#0891b2";
  if (name.toLowerCase().includes("experience")) return "#059669";
  if (name.toLowerCase().includes("skilled worker") || name.toLowerCase().includes("fsw")) return "#d97706";
  if (name.toLowerCase().includes("no program")) return "#dc2626";
  return "#2563eb";
}

export function CrsTrendChart({ points, title, subtitle }: { points: Point[]; title: string; subtitle: string }) {
  if (points.length < 2) return null;

  const W = 800;
  const H = 220;
  const PAD = { top: 16, right: 16, bottom: 36, left: 44 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const scores = points.map((p) => p.crs);
  const min = Math.min(...scores) - 10;
  const max = Math.max(...scores) + 10;

  const x = (i: number) => PAD.left + (i / (points.length - 1)) * innerW;
  const y = (v: number) => PAD.top + innerH - ((v - min) / (max - min)) * innerH;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.crs).toFixed(1)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L${x(points.length - 1).toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${PAD.left.toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`;

  const yTicks = 4;
  const tickStep = Math.ceil((max - min) / yTicks / 10) * 10;

  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
      <p className="text-sm font-bold text-foreground mb-0.5">{title}</p>
      <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ minWidth: 320, height: H }}
          aria-label="CRS score trend chart"
        >
          <defs>
            <linearGradient id="crsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Y grid lines */}
          {Array.from({ length: yTicks + 1 }, (_, i) => {
            const val = Math.round(min / tickStep) * tickStep + i * tickStep;
            if (val < min || val > max) return null;
            const yv = y(val);
            return (
              <g key={val}>
                <line x1={PAD.left} y1={yv} x2={PAD.left + innerW} y2={yv} stroke="#e5e7eb" strokeWidth="1" />
                <text x={PAD.left - 6} y={yv + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#crsGrad)" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="#dc2626" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          {/* Data points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={x(i)}
                cy={y(p.crs)}
                r="4"
                fill={programColor(p.program)}
                stroke="white"
                strokeWidth="1.5"
              />
              <title>{`${p.label}: CRS ${p.crs} — ${p.program}`}</title>
            </g>
          ))}

          {/* X axis labels (every 4th) */}
          {points.map((p, i) => {
            if (i % 4 !== 0 && i !== points.length - 1) return null;
            return (
              <text
                key={i}
                x={x(i)}
                y={H - 6}
                textAnchor="middle"
                fontSize="9"
                fill="#9ca3af"
              >
                {p.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
