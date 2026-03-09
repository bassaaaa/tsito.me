import Link from 'next/link';
import type { PostMeta } from '@/types/post';
import TagList from './TagList';
import CategoryChip from './CategoryChip';

type Props = {
	post: PostMeta;
};

export default function PostCard({ post }: Props) {
	return (
		<article className="py-8">
			<div className="flex items-center gap-2 mb-2">
				<time className="text-xs text-gray-500 dark:text-gray-400">{post.date}</time>
				<CategoryChip category={post.category} />
			</div>
			<Link href={`/blog/${post.slug}`}>
				<h2 className="font-semibold text-lg mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
					{post.title}
				</h2>
			</Link>
			<p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
				{post.description}
			</p>
			<TagList tags={post.tags} />
			<div className="mt-3">
				{post.externalUrl ? (
					<a
						href={post.externalUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
					>
						{post.externalLabel ?? '外部サイトで読む'} →
					</a>
				) : (
					<Link
						href={`/blog/${post.slug}`}
						className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
					>
						続きを読む →
					</Link>
				)}
			</div>
		</article>
	);
}
