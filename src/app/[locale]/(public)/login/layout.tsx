import type { Metadata } from "next";

const META: Record<string, { title: string; description: string }> = {
  en: { title: "Sign In", description: "Sign in securely to your IDLOGICE account." },
  fr: { title: "Connexion", description: "Connectez-vous en toute sécurité à votre compte IDLOGICE." },
  es: { title: "Iniciar sesión", description: "Inicie sesión de forma segura en su cuenta de IDLOGICE." },
  ar: { title: "تسجيل الدخول", description: "سجّل الدخول بأمان إلى حسابك في IDLOGICE." },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `https://idlogice.com/${locale}/login` },
    robots: { index: false, follow: false },
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
