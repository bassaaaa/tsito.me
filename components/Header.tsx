import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { SITE_NAME } from '../constant';

export default function Header() {
	return (
		<header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 backdrop-blur">
			<div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
				<Link
					href="/"
					className="font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
				>
					{SITE_NAME}
				</Link>
				<nav className="flex items-center gap-4">
					<Link
						href="/blog"
						className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
					>
						Blog
					</Link>
					<Link
						href="/about"
						className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
					>
						About
					</Link>
					<ThemeToggle />
				</nav>
			</div>
		</header>
	);
}
