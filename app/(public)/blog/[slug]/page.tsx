import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getBlogPost, getAllBlogSlugs } from '@/lib/content';
import { ArrowLeft, Calendar } from 'lucide-react';

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return { title: `${post.title} | Blog BM Clinics`, description: post.description };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const { content } = await compileMDX({ source: post.content });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b1324] py-12 px-4 sm:px-6">
      <article className="glass-card mx-auto max-w-3xl space-y-6 p-6 sm:p-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Wróć do bazy wiedzy
        </Link>

        <div className="space-y-2 border-b border-slate-200 pb-6 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-amber-500" />
            <span>{post.date}</span>
          </div>
          <h1 className="font-[family-name:var(--font-fraunces)] text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {post.title}
          </h1>
        </div>

        <div className="prose max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
          {content}
        </div>
      </article>
    </main>
  );
}
