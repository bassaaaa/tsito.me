import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';

export async function markdownToHtml(content: string): Promise<string> {
	const file = await unified()
		.use(remarkParse)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypePrettyCode, {
			theme: 'github-dark',
			keepBackground: true,
		})
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(content);

	return file.toString();
}
