import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
}

export function getAllBlogSlugs(): string[] {
  const dir = path.join(CONTENT_DIR, 'blog');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, 'blog', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    content,
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function getFaqItems(): FaqItem[] {
  const filePath = path.join(CONTENT_DIR, 'faq', 'faq.json');
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as FaqItem[];
}

export interface LandingContent {
  title: string;
  description: string;
  heroHeadline: string;
  heroSubtext: string;
  sections: { heading: string; body: string }[];
}

export function getLandingContent(slug: string): LandingContent | null {
  const filePath = path.join(CONTENT_DIR, 'landings', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as LandingContent;
}

export function getAllLandingSlugs(): string[] {
  const dir = path.join(CONTENT_DIR, 'landings');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}
