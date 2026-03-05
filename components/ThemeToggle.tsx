'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

function subscribe(cb: () => void) {
	window.addEventListener('storage', cb);
	return () => window.removeEventListener('storage', cb);
}

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const mounted = useSyncExternalStore(
		subscribe,
		() => true,
		() => false
	);

	if (!mounted) return <div className="w-9 h-9" />;

	return (
		<button
			onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
			className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
			aria-label="テーマ切り替え"
		>
			{theme === 'dark' ? '☀️' : '🌙'}
		</button>
	);
}
