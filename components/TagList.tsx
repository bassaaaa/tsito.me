import Link from 'next/link'

type Props = {
  tags: string[]
}

export default function TagList({ tags }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog/tag/${encodeURIComponent(tag)}`}
          className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          #{tag}
        </Link>
      ))}
    </div>
  )
}
