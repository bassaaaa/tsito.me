import { getAllPosts, getAllTags } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_NAME } from '@/constant';

type Props = {
	params: Promise<{ tag: string }>;
};

export async function generateStaticParams() {
	const tags = getAllTags();
	return tags.map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: Props) {
	const { tag } = await params;
	const tagName = decodeURIComponent(tag);
	return { title: `#${tagName} | ${SITE_NAME}` };
}

export default async function TagPage({ params }: Props) {
	const { tag } = await params;
	const tagName = decodeURIComponent(tag);
	const allPosts = getAllPosts();
	const posts = allPosts.filter((p) => p.tags.includes(tagName));

	if (posts.length === 0) notFound();

	return (
		<div className="max-w-3xl mx-auto px-4 py-10">
			<div className="mb-6">
				<Link
					href="/blog"
					className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
				>
					← 記事一覧
				</Link>
			</div>
			<h1 className="text-2xl font-bold mb-6">
				タグ: <span className="text-gray-700 dark:text-gray-300">#{tagName}</span>
			</h1>
			<div className="flex flex-col gap-4">
				{posts.map((post) => (
					<PostCard key={post.slug} post={post} />
				))}
			</div>
		</div>
	);
}
