"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { CalendarCheck } from "lucide-react";

export function FloatingCta() {
  const pathname = usePathname();
  if (pathname.includes("/book-consultation") || pathname.includes("/checkout")) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="/calculator"
        className="group flex items-center gap-2.5 rounded-full bg-[oklch(0.52_0.22_27)] hover:bg-[oklch(0.58_0.22_27)] text-white font-semibold text-sm shadow-lg shadow-[oklch(0.52_0.22_27/0.4)] hover:shadow-xl hover:shadow-[oklch(0.52_0.22_27/0.5)] transition-all duration-200 pl-4 pr-5 py-3.5"
      >
        <CalendarCheck className="size-4 shrink-0" />
        <span>Profile Evaluation</span>
      </Link>
    </div>
  );
}
