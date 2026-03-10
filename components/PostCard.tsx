import Link from 'next/link';
import type { PostMeta } from '@/types/post';
import TagList from './TagList';
import CategoryChip from './CategoryChip';

type Props = {
	post: PostMeta;
};

export default function PostCard({ post }: Props) {
	const titleEl = (
		<h2 className="font-semibold text-lg mb-1.5 leading-snug inline-flex items-center gap-1.5">
			{post.title}
			{post.externalUrl && (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					className="size-3.5 shrink-0 opacity-60"
					aria-hidden="true"
				>
					<path
						fillRule="evenodd"
						d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z"
						clipRule="evenodd"
					/>
					<path
						fillRule="evenodd"
						d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z"
						clipRule="evenodd"
					/>
				</svg>
			)}
		</h2>
	);

	return (
		<article className="py-7 border-b border-(--border) last:border-0">
			<div className="flex items-center gap-2 mb-2">
				<time className="text-xs text-(--muted) font-mono">{post.date}</time>
				<span className="text-(--border)">·</span>
				<CategoryChip category={post.category} />
			</div>
			<div className="hover:text-(--accent) transition-colors">
				{post.externalUrl ? (
					<a href={post.externalUrl} target="_blank" rel="noopener noreferrer">
						{titleEl}
					</a>
				) : (
					<Link href={`/blog/${post.slug}`}>{titleEl}</Link>
				)}
			</div>
			<p className="text-sm text-(--muted) mb-3 line-clamp-2 leading-relaxed">
				{post.description}
			</p>
			<TagList tags={post.tags} />
			<div className="mt-3">
				{post.externalUrl ? (
					<a
						href={post.externalUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-(--accent) hover:text-(--accent-hover) hover:underline transition-colors"
					>
						{post.externalLabel ?? '外部サイトで読む'} →
					</a>
				) : (
					<Link
						href={`/blog/${post.slug}`}
						className="text-sm text-(--accent) hover:text-(--accent-hover) hover:underline transition-colors"
					>
						続きを読む →
					</Link>
				)}
			</div>
		</article>
	);
}
