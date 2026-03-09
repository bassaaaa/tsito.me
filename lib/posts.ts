import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Post, PostMeta } from '@/types/post';

const contentDir = path.join(process.cwd(), 'content');

function getMdFiles(dir: string): string[] {
	const files: string[] = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...getMdFiles(fullPath));
		} else if (entry.name.endsWith('.md')) {
			files.push(fullPath);
		}
	}
	return files;
}

export function getAllPosts(): PostMeta[] {
	const files = getMdFiles(contentDir);
	const posts = files.map((filePath) => {
		const raw = fs.readFileSync(filePath, 'utf-8');
		const { data } = matter(raw);
		const slug = path.basename(filePath, '.md');
		return {
			slug,
			title: data.title ?? '',
			date: data.date ?? '',
			category: data.category ?? '',
			tags: data.tags ?? [],
			description: data.description ?? '',
			published: data.published ?? false,
			thumbnail: data.thumbnail,
			externalUrl: data.externalUrl,
			externalLabel: data.externalLabel,
		} as PostMeta;
	});

	return posts.filter((p) => p.published).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
	const files = getMdFiles(contentDir);
	const filePath = files.find((f) => path.basename(f, '.md') === slug);
	if (!filePath) return null;

	const raw = fs.readFileSync(filePath, 'utf-8');
	const { data, content } = matter(raw);

	return {
		slug,
		title: data.title ?? '',
		date: data.date ?? '',
		category: data.category ?? '',
		tags: data.tags ?? [],
		description: data.description ?? '',
		published: data.published ?? false,
		thumbnail: data.thumbnail,
		externalUrl: data.externalUrl,
		externalLabel: data.externalLabel,
		content,
	};
}

export function getAllCategories(): string[] {
	const posts = getAllPosts();
	return [...new Set(posts.map((p) => p.category))].sort();
}

export function getAllTags(): string[] {
	const posts = getAllPosts();
	return [...new Set(posts.flatMap((p) => p.tags))].sort();
}
