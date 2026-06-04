import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Book Consultation — Checkout",
    description: "Secure checkout for an IDLOGICE immigration consultation.",
    alternates: { canonical: `https://idlogice.com/${locale}/book-consultation/checkout` },
    robots: { index: false, follow: false },
  };
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
