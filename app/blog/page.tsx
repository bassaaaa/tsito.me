import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

type Props = {
	searchParams: Promise<{ category?: string; tag?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
	const params = await searchParams;
	const allPosts = getAllPosts();
	const categories = getAllCategories();
	const tags = getAllTags();

	const filtered = allPosts.filter((post) => {
		if (params.category && post.category !== params.category) return false;
		if (params.tag && !post.tags.includes(params.tag)) return false;
		return true;
	});

	return (
		<div className="max-w-3xl mx-auto px-4 py-10">
			<h1 className="text-2xl font-bold mb-6">記事一覧</h1>

			<div className="flex flex-wrap gap-2 mb-4">
				<Link
					href="/blog"
					className={`text-xs px-3 py-1 rounded-full border transition-colors ${
						!params.category && !params.tag
							? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-transparent'
							: 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
					}`}
				>
					すべて
				</Link>
				{categories.map((cat) => (
					<Link
						key={cat}
						href={`/blog?category=${encodeURIComponent(cat)}`}
						className={`text-xs px-3 py-1 rounded-full border transition-colors ${
							params.category === cat
								? 'bg-blue-600 text-white border-transparent'
								: 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
						}`}
					>
						{cat}
					</Link>
				))}
			</div>

			<div className="flex flex-wrap gap-1.5 mb-6">
				{tags.map((tag) => (
					<Link
						key={tag}
						href={`/blog?tag=${encodeURIComponent(tag)}`}
						className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
							params.tag === tag
								? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
								: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
						}`}
					>
						#{tag}
					</Link>
				))}
			</div>

			<div className="flex flex-col gap-4">
				{filtered.length === 0 ? (
					<p className="text-gray-500 dark:text-gray-400">記事が見つかりませんでした。</p>
				) : (
					filtered.map((post) => <PostCard key={post.slug} post={post} />)
				)}
			</div>
		</div>
	);
}
