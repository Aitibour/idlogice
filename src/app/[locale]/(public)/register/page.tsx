import { redirect } from "next/navigation";

export default async function RegisterRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale } = await params;
  const { next } = await searchParams;
  const nextParam = next ? `?next=${encodeURIComponent(next)}` : "";
  redirect(`/${locale}/login${nextParam}`);
}
