import Link from 'next/link';

type Crumb = { label: string; href?: string };

type Props = { crumbs: Crumb[] };

export default function Breadcrumb({ crumbs }: Props) {
	return (
		<nav className="flex items-center gap-1.5 text-xs text-(--muted) mb-8 min-w-0">
			{crumbs.map((crumb, i) => (
				<span key={i} className={`flex items-center gap-1.5${!crumb.href ? ' min-w-0 overflow-hidden' : ' shrink-0'}`}>
					{i > 0 && <span className="shrink-0">/</span>}
					{crumb.href ? (
						<Link href={crumb.href} className="hover:text-(--accent) transition-colors">
							{crumb.label}
						</Link>
					) : (
						<span className="text-(--foreground) truncate">{crumb.label}</span>
					)}
				</span>
			))}
		</nav>
	);
}
