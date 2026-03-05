import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { markdownToHtml } from '@/lib/mdx'
import TagList from '@/components/TagList'
import Link from 'next/link'
import CategoryChip from '@/components/CategoryChip'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} | my-tech-blog`,
    description: post.description,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const html = await markdownToHtml(post.content)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-2">
        <CategoryChip category={post.category} />
      </div>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="flex items-center gap-3 mb-4">
        <time className="text-sm text-gray-500 dark:text-gray-400">{post.date}</time>
      </div>
      <div className="mb-6">
        <TagList tags={post.tags} />
      </div>
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
        <Link href="/blog" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← 記事一覧へ
        </Link>
      </div>
    </div>
  )
}
