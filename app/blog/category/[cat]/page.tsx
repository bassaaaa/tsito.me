import { getAllPosts, getAllCategories } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_NAME } from '@/constant';

type Props = {
	params: Promise<{ cat: string }>;
};

export async function generateStaticParams() {
	return getAllCategories().map((cat) => ({ cat: encodeURIComponent(cat) }));
}

export async function generateMetadata({ params }: Props) {
	const { cat } = await params;
	return { title: `${decodeURIComponent(cat)} | ${SITE_NAME}` };
}

export default async function CategoryPage({ params }: Props) {
	const { cat } = await params;
	const category = decodeURIComponent(cat);
	const posts = getAllPosts().filter((p) => p.category === category);

	if (posts.length === 0) notFound();

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
			<div className="mb-8">
				<Link href="/blog" className="text-sm text-(--muted) hover:text-(--accent) transition-colors">
					← Blog
				</Link>
				<div className="mt-4">
					<p className="text-xs font-semibold uppercase tracking-widest text-(--muted) mb-1">Category</p>
					<h1 className="text-2xl font-bold">{category}</h1>
				</div>
			</div>
			<div>
				{posts.map((post) => <PostCard key={post.slug} post={post} />)}
			</div>
		</div>
	);
}
