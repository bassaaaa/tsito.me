import Image from 'next/image';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import { SITE_NAME } from '@/constant';

export async function generateMetadata() {
	return { title: `Home | ${SITE_NAME}` };
}

export default function Home() {
	const posts = getAllPosts().slice(0, 5);

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
			{/* Profile */}
			<section className="mb-12 pb-12 border-b border-(--border) flex flex-row items-center gap-6">
				<div className="shrink-0">
					<Image
						src="/my_icon_bg_white.png"
						alt="アイコン"
						width={80}
						height={80}
						className="rounded-full ring-2 ring-(--accent) ring-offset-2 ring-offset-(--background)"
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<p className="font-bold text-xl">tsito</p>
					<p className="text-(--muted) text-sm leading-relaxed">
						エンジニア / 42 Tokyo / ゲーム・ガジェット好き
					</p>
					<Link
						href="/about"
						className="text-sm text-(--accent) hover:text-(--accent-hover) hover:underline self-start transition-colors mt-0.5"
					>
						詳しく見る →
					</Link>
				</div>
			</section>

			{/* Latest posts */}
			<section>
				<h2 className="text-xs font-semibold uppercase tracking-widest text-(--accent) mb-6">
					Latest Posts
				</h2>
				<div>
					{posts.map((post) => (
						<PostCard key={post.slug} post={post} />
					))}
				</div>
				<div className="mt-8 text-right">
					<Link
						href="/blog"
						className="text-sm text-(--accent) hover:text-(--accent-hover) transition-colors"
					>
						すべての記事 →
					</Link>
				</div>
			</section>
		</div>
	);
}
