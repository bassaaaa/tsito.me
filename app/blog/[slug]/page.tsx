import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { markdownToHtml } from '@/lib/mdx';
import TagList from '@/components/TagList';
import Link from 'next/link';
import CategoryChip from '@/components/CategoryChip';
import { SITE_NAME } from '@/constant';
import TableOfContents from '@/components/TableOfContents';

type Props = {
	params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
	return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
	const { slug } = await params;
	const post = getPostBySlug(slug);
	if (!post) return {};
	return { title: `${post.title} | ${SITE_NAME}`, description: post.description };
}

export default async function BlogPostPage({ params }: Props) {
	const { slug } = await params;
	const post = getPostBySlug(slug);
	if (!post) notFound();

	const { html, headings } = await markdownToHtml(post.content);

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-3">
					<CategoryChip category={post.category} />
					<time className="text-xs text-(--muted) font-mono">{post.date}</time>
				</div>
				<h1 className="text-3xl font-bold leading-tight mb-4">{post.title}</h1>
				<TagList tags={post.tags} />
			</div>

			<TableOfContents headings={headings} />

			<article className="prose" dangerouslySetInnerHTML={{ __html: html }} />

			<div className="mt-12 pt-6 border-t border-(--border)">
				<Link
					href="/blog"
					className="text-sm text-(--accent) hover:text-(--accent-hover) transition-colors"
				>
					← Blog 一覧へ
				</Link>
			</div>
		</div>
	);
}
