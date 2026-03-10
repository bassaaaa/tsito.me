import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { SITE_NAME } from '../constant';

export default function Header() {
	return (
		<header className="sticky top-0 z-50 border-b border-(--border) backdrop-blur">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
				<Link
					href="/"
					className="font-bold text-base tracking-tight site-name-glow"
				>
					{SITE_NAME}
				</Link>
				<nav className="flex items-center gap-5">
					<Link
						href="/blog"
						className="text-sm text-(--muted) hover:text-foreground transition-colors"
					>
						Blog
					</Link>
					<Link
						href="/about"
						className="text-sm text-(--muted) hover:text-foreground transition-colors"
					>
						About
					</Link>
					<ThemeToggle />
				</nav>
			</div>
		</header>
	);
}
