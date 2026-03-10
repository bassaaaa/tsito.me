import { SITE_NAME } from '../constant';

export default function Footer() {
	const startYear = 2026;
	const currentYear = new Date().getFullYear();
	const yearText = currentYear == startYear ? `${startYear}` : `${startYear} - ${currentYear}`;

	return (
		<footer className="border-t border-(--border) mt-16">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 text-center text-sm text-(--muted)">
				© {yearText} {SITE_NAME}
			</div>
		</footer>
	);
}
