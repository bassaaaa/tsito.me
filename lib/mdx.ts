import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { fetchOgp, type OgpData } from './ogp';
import { getPostBySlug } from './posts';
import { SITE_NAME } from '@/constant';

export type Heading = { id: string; text: string; level: number };

type MarkdownNode = {
	type: string;
	value?: string;
	children?: MarkdownNode[];
};

type NoteType = keyof typeof noteLabels;

const noteLabels = {
	info: 'INFO',
	warn: 'WARN',
	alert: 'ALERT',
} as const;

export async function markdownToHtml(
	content: string,
): Promise<{ html: string; headings: Heading[] }> {
	const headings: Heading[] = [];
	const normalizedContent = normalizeQuoteFences(content);

	const file = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkNoteBlocks)
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
						child.tagName === 'p'
					) {
						const text = extractText(child);
						const embedMatch = text.match(/^::embed\[(.+)\]$/);
						const internalMatch = text.match(/^::embed-internal\[(.+)\]$/);
						if (internalMatch) {
							const slug = internalMatch[1];
							const index = i;
							const parent = node;
							const post = getPostBySlug(slug);
							if (post) {
								parent.children[index] = buildInternalCardNode(post);
							}
						} else if (embedMatch) {
							const url = embedMatch[1];
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
		.process(normalizedContent);

	return { html: file.toString(), headings };
}

function remarkNoteBlocks() {
	return (tree: MarkdownNode) => {
		transformNoteBlocks(tree);
	};
}

function transformNoteBlocks(node: MarkdownNode) {
	if (!node.children) return;

	for (const child of node.children) {
		transformNoteBlocks(child);
	}

	const nextChildren: MarkdownNode[] = [];
	for (let i = 0; i < node.children.length; i++) {
		const child = node.children[i];
		const inlineNoteType = getInlineNoteType(child);
		if (inlineNoteType) {
			const noteBody = stripInlineNoteMarkers(child);
			nextChildren.push(buildNoteStartNode(inlineNoteType));
			nextChildren.push(noteBody);
			nextChildren.push(buildNoteEndNode());
			continue;
		}

		const noteType = getNoteStartType(child);
		if (!noteType) {
			nextChildren.push(child);
			continue;
		}

		const closeIndex = node.children.findIndex((candidate, index) => (
			index > i && isNoteEnd(candidate)
		));
		if (closeIndex === -1) {
			nextChildren.push(child);
			continue;
		}

		nextChildren.push(buildNoteStartNode(noteType));
		nextChildren.push(...node.children.slice(i + 1, closeIndex));
		nextChildren.push(buildNoteEndNode());
		i = closeIndex;
	}

	node.children = nextChildren;
}

function buildNoteStartNode(noteType: NoteType): MarkdownNode {
	const label = noteLabels[noteType];
	return {
		type: 'html',
		value: `<aside class="note-block note-${noteType}"><div class="note-heading"><span class="note-icon" aria-hidden="true"></span><span class="note-label">${label}</span></div>`,
	};
}

function buildNoteEndNode(): MarkdownNode {
	return { type: 'html', value: '</aside>' };
}

function getNoteStartType(node: MarkdownNode): NoteType | null {
	const text = extractMarkdownText(node).trim();
	const match = text.match(/^:::note\s+(info|warn|alert)$/);
	return match ? (match[1] as NoteType) : null;
}

function getInlineNoteType(node: MarkdownNode): NoteType | null {
	const text = extractMarkdownText(node).trim();
	const match = text.match(/^:::note\s+(info|warn|alert)\s+[\s\S]*\s+:::$/);
	return match ? (match[1] as NoteType) : null;
}

function stripInlineNoteMarkers(node: MarkdownNode): MarkdownNode {
	const stripped = structuredClone(node);
	const children = stripped.children ?? [];
	const firstText = children.find((child) => child.type === 'text');
	const lastText = [...children].reverse().find((child) => child.type === 'text');

	if (firstText?.value) {
		firstText.value = firstText.value.replace(/^:::note\s+(info|warn|alert)\s*/, '');
	}
	if (lastText?.value) {
		lastText.value = lastText.value.replace(/\s*:::$/, '');
	}

	stripped.children = children.filter((child) => (
		child.type !== 'text' || (child.value ?? '').length > 0
	));
	return stripped;
}

function isNoteEnd(node: MarkdownNode): boolean {
	return extractMarkdownText(node).trim() === ':::';
}

function extractMarkdownText(node: MarkdownNode): string {
	if (node.type === 'text') return node.value ?? '';
	return (node.children ?? []).map(extractMarkdownText).join('');
}

function normalizeQuoteFences(content: string): string {
	const lines = content.split('\n');
	const normalized: string[] = [];
	let inQuote = false;
	let inCodeFence = false;

	for (const line of lines) {
		if (/^\s*(```|~~~)/.test(line)) {
			inCodeFence = !inCodeFence;
			normalized.push(line);
			continue;
		}
		if (!inCodeFence && line.trim() === '>>>') {
			inQuote = !inQuote;
			continue;
		}
		normalized.push(inQuote ? `> ${line}` : line);
	}

	return normalized.join('\n');
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
			children: [
				{
					type: 'element',
					tagName: 'span',
					properties: { className: ['ogp-card-title-text'] },
					children: [{ type: 'text', value: ogp.title }],
				},
			],
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

function buildInternalCardNode(post: { slug: string; title: string; description: string; date: string }) {
	const contentChildren = [
		{
			type: 'element',
			tagName: 'p',
			properties: { className: ['ogp-card-title'] },
			children: [
				{
					type: 'element',
					tagName: 'span',
					properties: { className: ['ogp-card-title-text'] },
					children: [{ type: 'text', value: post.title }],
				},
			],
		},
		...(post.description
			? [
					{
						type: 'element',
						tagName: 'p',
						properties: { className: ['ogp-card-description'] },
						children: [{ type: 'text', value: post.description }],
					},
				]
			: []),
		{
			type: 'element',
			tagName: 'div',
			properties: { className: ['ogp-card-site'] },
			children: [
				{
					type: 'element',
					tagName: 'img',
					properties: {
						className: ['ogp-card-favicon'],
						src: '/my_icon.png',
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
					children: [{ type: 'text', value: SITE_NAME }],
				},
			],
		},
	];

	return {
		type: 'element',
		tagName: 'a',
		properties: {
			href: `/blog/${post.slug}`,
			className: ['ogp-card'],
		},
		children: [
			{
				type: 'element',
				tagName: 'div',
				properties: { className: ['ogp-card-content'] },
				children: contentChildren,
			},
			{
				type: 'element',
				tagName: 'div',
				properties: { className: ['ogp-card-thumbnail', 'ogp-card-thumbnail-internal'] },
				children: [
					{
						type: 'element',
						tagName: 'img',
						properties: {
							className: ['ogp-card-image'],
							src: `/blog/${post.slug}/opengraph-image`,
							alt: post.title,
						},
						children: [],
					},
				],
			},
		],
	};
}
