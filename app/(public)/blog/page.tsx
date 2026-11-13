import Link from 'next/link';
import { getAllBlogSlugs, getBlogPost } from '@/lib/content';
import { BookOpen, Calendar, ArrowRight, UserCheck } from 'lucide-react';

export const metadata = {
  title: 'Blog Medyczny & Wiedza Dla Pacjentów',
  description:
    'Praktyczne artykuły o chirurgii ambulatoryjnej, przygotowaniu do zabiegów proktologicznych i flebologicznych pisane przez specjalistów BM Clinics.',
};

export default function BlogListPage() {
  const posts = getAllBlogSlugs()
    .map((slug) => getBlogPost(slug))
    .filter((p): p is NonNullable<typeof p> => p !== null);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b1324] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Banner Header */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 sm:p-12 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 mb-4">
            <BookOpen className="h-7 w-7" />
          </div>
          <span className="text-xs font-bold tracking-widest text-amber-400 uppercase text-center block">
            Baza Wiedzy & Porady Lekarskie
          </span>
          <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-bold sm:text-4xl lg:text-5xl text-center">
            Blog Medyczny BM Clinics
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto text-center leading-relaxed">
            Eksperckie publikacje dotyczące przygotowania do procedur chirurgicznych, znieczulenia i pielęgnacji pozabiegowej.
          </p>
        </div>

        {/* Blog Post List */}
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-800">
            Artykuły pojawią się wkrótce.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group glass-card flex flex-col justify-between p-6 transition hover:border-amber-500/40"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-3">
                    <Calendar className="h-3.5 w-3.5 text-amber-500" />
                    <span>{post.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <UserCheck className="h-3.5 w-3.5" /> Zespół Medyczny
                    </span>
                  </div>

                  <Link href={`/blog/${post.slug}`} className="group-hover:text-amber-600 transition">
                    <h2 className="font-[family-name:var(--font-fraunces)] text-xl font-bold text-slate-900 dark:text-white leading-snug">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition"
                  >
                    Przeczytaj cały artykuł
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
