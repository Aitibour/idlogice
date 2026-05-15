import { notFound } from "next/navigation";
import Image from "next/image";
import { createServiceClient } from "@/lib/supabase/service";
import { PostBody } from "@/components/blog/PostBody";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  // Skip static generation if Supabase env vars missing at build time —
  // pages will be rendered on-demand via ISR.
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return [];
  }
  try {
    const db = createServiceClient();
    const { data } = await db
      .from("blog_posts")
      .select("slug")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(10);
    return (data ?? []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const db = createServiceClient();
  const { data } = await db
    .from("blog_posts")
    .select("title, meta_desc, image_url")
    .eq("slug", slug)
    .single();

  if (!data) return {};
  const title = (data.title as Record<string, string>)[locale] ?? (data.title as Record<string, string>).en;
  const desc = (data.meta_desc as Record<string, string>)[locale] ?? (data.meta_desc as Record<string, string>).en;

  return {
    title,
    description: desc,
    openGraph: { title, description: desc, images: data.image_url ? [data.image_url] : [] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const db = createServiceClient();

  const { data: post } = await db
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const title = (post.title as Record<string, string>)[locale] ?? (post.title as Record<string, string>).en;
  const content = (post.content as Record<string, string>)[locale] ?? (post.content as Record<string, string>).en;
  const date = new Date(post.published_at).toLocaleDateString(
    locale === "fr" ? "fr-CA" : "en-CA",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <article className="container mx-auto px-4 py-16 max-w-3xl">
      {post.image_url && (
        <div className="relative aspect-video w-full mb-10 rounded-xl overflow-hidden">
          <Image
            src={post.image_url}
            alt={post.image_alt ?? title}
            fill
            className="object-cover"
            priority
          />
          {post.image_credit && (
            <p className="absolute bottom-2 right-3 text-xs text-white/70">{post.image_credit}</p>
          )}
        </div>
      )}
      <p className="text-sm text-muted-foreground mb-3">{date}</p>
      <h1 className="text-4xl font-bold leading-tight mb-8">{title}</h1>
      <PostBody content={content} />
      {post.source_url && (
        <p className="mt-12 text-sm text-muted-foreground border-t pt-4">
          Source:{" "}
          <a
            href={post.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {post.source_title ?? post.source_url}
          </a>
        </p>
      )}
    </article>
  );
}
