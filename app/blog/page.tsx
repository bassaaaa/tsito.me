import { getAllPosts, getAllCategories } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { SITE_NAME } from '@/constant';

type Props = {
	searchParams: Promise<{ category?: string; tag?: string }>;
};

export async function generateMetadata() {
	return { title: `Blog | ${SITE_NAME}`, description: '記事一覧' };
}

export default async function BlogPage({ searchParams }: Props) {
	const params = await searchParams;
	const allPosts = getAllPosts();
	const categories = getAllCategories();

	const filtered = allPosts.filter((post) => {
		if (params.category && post.category !== params.category) return false;
		if (params.tag && !post.tags.includes(params.tag)) return false;
		return true;
	});

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
			<h1 className="text-2xl font-bold mb-8">Blog</h1>

			{/* Filters */}
			<div className="mb-8 space-y-3">
				<div className="flex flex-wrap gap-2">
					<Link
						href="/blog"
						className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
							!params.category && !params.tag
								? 'bg-(--accent) text-white border-(--accent)'
								: 'border-(--border) text-(--muted) hover:border-(--accent) hover:text-(--accent)'
						}`}
					>
						すべて
					</Link>
					{categories.map((cat) => (
						<Link
							key={cat}
							href={`/blog?category=${encodeURIComponent(cat)}`}
							className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
								params.category === cat
									? 'bg-(--accent) text-white border-(--accent)'
									: 'border-(--border) text-(--muted) hover:border-(--accent) hover:text-(--accent)'
							}`}
						>
							{cat}
						</Link>
					))}
				</div>
			</div>

			<div>
				{filtered.length === 0 ? (
					<p className="text-(--muted) text-sm">記事が見つかりませんでした。</p>
				) : (
					filtered.map((post) => <PostCard key={post.slug} post={post} />)
				)}
			</div>
		</div>
	);
}
