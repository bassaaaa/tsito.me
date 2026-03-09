import type { Metadata } from 'next';
import Image from 'next/image';
import { SITE_NAME } from '../../constant';

export const metadata: Metadata = {
	title: `About | ${SITE_NAME}`,
	description: 'このブログについて',
};

export default function AboutPage() {
	return (
		<div className="max-w-3xl mx-auto px-4 py-10">
			{/* Hero */}
			<div className="flex flex-col items-center text-center mb-16">
				<Image
					src="/my_icon_bg_white.png"
					alt="アイコン"
					width={160}
					height={160}
					className="rounded-full border border-gray-200 dark:border-gray-700 mb-5"
				/>
				<h1 className="text-4xl font-bold tracking-wide mb-1">tsito</h1>
			</div>

			{/* Bio */}
			<section className="mb-12 pb-12 border-b border-gray-200 dark:border-gray-800">
				<h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
					About
				</h2>
				<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
					1996年生まれ、広島県出身
					<br />
					都内でエンジニアとして働いています
					<br />
					ゲーム・ガジェットが好き <br />
					42 Tokyo 2026-02 Piscine → 2026-04 KickOff
				</p>
			</section>

			{/* Skills */}
			<section className="mb-12 pb-12 border-b border-gray-200 dark:border-gray-800">
				<h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
					Skills
				</h2>
				<div className="flex flex-wrap gap-2">
					{['C', 'TypeScript', 'React', 'Next.js', 'PHP', 'SQL'].map((skill) => (
						<span
							key={skill}
							className="px-3 py-1 rounded-full text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
						>
							{skill}
						</span>
					))}
				</div>
			</section>

			{/* Blog */}
			<section>
				<h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
					This Blog
				</h2>
				<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
					未来の自分のため、42 Tokyoでの学習記録をひっそり蓄積するのが主な目的です。
					プレイしたゲームや購入したガジェットなどの趣味の話も気が向けば。
				</p>
			</section>
		</div>
	);
}
