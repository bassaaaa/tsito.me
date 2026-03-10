import Link from 'next/link';

type Props = {
	category: string;
};

export default function CategoryChip({ category }: Props) {
	return (
		<Link
			href={`/blog/category/${encodeURIComponent(category)}`}
			className="text-xs font-medium px-2 py-0.5 rounded-md bg-(--tag-bg) text-(--accent) border border-(--tag-border) hover:bg-(--accent) hover:text-white hover:border-(--accent) transition-colors"
		>
			{category}
		</Link>
	);
}
