import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { fetchOgp, type OgpData } from './ogp';

export type Heading = { id: string; text: string; level: number };

export async function markdownToHtml(
	content: string,
): Promise<{ html: string; headings: Heading[] }> {
	const headings: Heading[] = [];

	const file = await unified()
		.use(remarkParse)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeSlug)
		.use(() => async (tree) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const tasks: Array<() => Promise<void>> = [];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			function walk(node: any) {
				if (!node.children) return;
				for (let i = 0; i < node.children.length; i++) {
					const child = node.children[i];
					if (
						child.type === 'element' &&
						child.tagName === 'p' &&
						child.children.length === 1 &&
						child.children[0].type === 'text'
					) {
						const match = (child.children[0].value as string).match(/^::embed\[(.+)\]$/);
						if (match) {
							const url = match[1];
							const index = i;
							const parent = node;
							tasks.push(async () => {
								const ogp = await fetchOgp(url);
								parent.children[index] = buildOgpCardNode(ogp);
							});
						}
					}
					walk(child);
				}
			}
			walk(tree);
			await Promise.all(tasks.map((t) => t()));
		})
		.use(rehypePrettyCode, {
			theme: 'github-dark',
			keepBackground: true,
		})
		.use(() => (tree) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const visit = (node: any) => {
				if (node.type === 'element' && /^h[2-3]$/.test(node.tagName)) {
					const level = parseInt(node.tagName[1], 10);
					const id = node.properties?.id as string | undefined;
					const text = extractText(node);
					if (id && text) headings.push({ id, text, level });
				}
				node.children?.forEach(visit);
			};
			visit(tree);
		})
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(content);

	return { html: file.toString(), headings };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractText(node: any): string {
	if (node.type === 'text') return node.value;
	return (node.children ?? []).map(extractText).join('');
}

function buildOgpCardNode(ogp: OgpData) {
	const hostname = new URL(ogp.url).hostname;
	const faviconUrl = `https://www.google.com/s2/favicons?sz=32&domain=${hostname}`;

	const imageNode = ogp.image
		? [
				{
					type: 'element',
					tagName: 'div',
					properties: { className: ['ogp-card-thumbnail'] },
					children: [
						{
							type: 'element',
							tagName: 'img',
							properties: {
								className: ['ogp-card-image'],
								src: ogp.image,
								alt: ogp.title,
							},
							children: [],
						},
					],
				},
			]
		: [];

	const siteInfo = {
		type: 'element',
		tagName: 'div',
		properties: { className: ['ogp-card-site'] },
		children: [
			{
				type: 'element',
				tagName: 'img',
				properties: {
					className: ['ogp-card-favicon'],
					src: faviconUrl,
					alt: '',
					width: '14',
					height: '14',
				},
				children: [],
			},
			{
				type: 'element',
				tagName: 'span',
				properties: {},
				children: [{ type: 'text', value: ogp.siteName }],
			},
		],
	};

	const contentChildren = [
		{
			type: 'element',
			tagName: 'p',
			properties: { className: ['ogp-card-title'] },
			children: [{ type: 'text', value: ogp.title }],
		},
		...(ogp.description
			? [
					{
						type: 'element',
						tagName: 'p',
						properties: { className: ['ogp-card-description'] },
						children: [{ type: 'text', value: ogp.description }],
					},
				]
			: []),
		siteInfo,
	];

	return {
		type: 'element',
		tagName: 'a',
		properties: {
			href: ogp.url,
			target: '_blank',
			rel: ['noopener', 'noreferrer'],
			className: ['ogp-card'],
		},
		children: [
			{
				type: 'element',
				tagName: 'div',
				properties: { className: ['ogp-card-content'] },
				children: contentChildren,
			},
			...imageNode,
		],
	};
}
