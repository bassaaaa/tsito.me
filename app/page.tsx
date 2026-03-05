import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import { SITE_NAME } from '../constant';

export default function Home() {
	const posts = getAllPosts().slice(0, 5);

	return (
		<div className="max-w-3xl mx-auto px-4 py-10">
			<section className="mb-10">
				<h1 className="text-3xl font-bold mb-2">{SITE_NAME}</h1>
				<p className="text-gray-600 dark:text-gray-400">
					技術・学習・趣味について書くブログ
				</p>
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-5">最新記事</h2>
				<div className="flex flex-col gap-4">
					{posts.map((post) => (
						<PostCard key={post.slug} post={post} />
					))}
				</div>
				<div className="mt-6 text-right">
					<Link
						href="/blog"
						className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
					>
						記事一覧へ →
					</Link>
				</div>
			</section>
		</div>
	);
}
