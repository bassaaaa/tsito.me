export type PostMeta = {
	slug: string;
	title: string;
	date: string;
	category: string;
	tags: string[];
	description: string;
	published: boolean;
	thumbnail?: string;
	externalUrl?: string;
	externalLabel?: string;
};

export type Post = PostMeta & { content: string };
