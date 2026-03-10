'use client';

import { useState } from 'react';
import type { Heading } from '@/lib/mdx';

type Props = { headings: Heading[] };

export default function TableOfContents({ headings }: Props) {
	const [open, setOpen] = useState(true);

	if (headings.length === 0) return null;

	return (
		<nav className="mb-10 rounded-lg border border-(--border) bg-(--surface) text-sm overflow-hidden">
			<button
				onClick={() => setOpen((v) => !v)}
				className="w-full flex items-center gap-2 px-4 py-3 font-semibold text-foreground cursor-pointer hover:text-(--accent) transition-colors"
				aria-expanded={open}
			>
				<span
					className="text-xs text-(--muted) transition-transform duration-200"
					style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
				>
					▶
				</span>
				目次
			</button>

			{open && (
				<ol className="px-4 pb-4 space-y-1.5">
					{headings.map(({ id, text, level }) => (
						<li key={id} style={{ paddingLeft: `${(level - 2) * 1}rem` }}>
							<a
								href={`#${id}`}
								className="text-(--muted) hover:text-(--accent) transition-colors"
							>
								{text}
							</a>
						</li>
					))}
				</ol>
			)}
		</nav>
	);
}
