import { SITE_NAME } from '../constant';

export default function Footer() {
	const startYear = 2026;
	const currentYear = new Date().getFullYear();
	const yearText = currentYear == startYear ? `${startYear}` : `${startYear} - ${currentYear}`;

	return (
		<footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
			<div className="max-w-3xl mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
				© {yearText} {SITE_NAME}
			</div>
		</footer>
	);
}
