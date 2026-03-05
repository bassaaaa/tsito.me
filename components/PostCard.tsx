import Link from 'next/link';
import type { PostMeta } from '@/types/post';
import TagList from './TagList';
import CategoryChip from './CategoryChip';

type Props = {
	post: PostMeta;
};

export default function PostCard({ post }: Props) {
	return (
		<article className="border border-gray-200 dark:border-gray-800 rounded-lg p-5 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
			<div className="flex items-center gap-2 mb-2">
				<CategoryChip category={post.category} />
				<time className="text-xs text-gray-500 dark:text-gray-400">{post.date}</time>
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
		</article>
	);
}
