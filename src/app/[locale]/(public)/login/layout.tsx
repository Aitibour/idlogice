import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(_props: Props): Promise<Metadata> {
  return {
    title: "Sign In",
    robots: { index: false, follow: false },
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}