import Link from 'next/link'

type Props = {
	category: string
}

export default function CategoryChip({ category }: Props) {
	return (
		<Link
			key={category}
			href={`/blog/category/${encodeURIComponent(category)}`}
			className="text-xs font-medium px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-700/30 text-blue-800 dark:text-blue-300 hover:bg-blue-300 dark:hover:bg-blue-600/30 transition-colors"
		>
			{category}
		</Link>
	)
}
