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
			<h1 className="text-3xl font-bold mb-8">About</h1>

			<section className="mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
				<div className="shrink-0">
					<Image
						src="/my_icon_bg_white.png"
						alt="アイコン"
						width={120}
						height={120}
						className="rounded-full border border-gray-200 dark:border-gray-700"
					/>
				</div>
				<div>
					<h2 className="text-xl font-semibold mb-3">自己紹介</h2>
					<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
						1996年生まれ、広島県出身。都内でエンジニアとして働いています。
						<br />
						ゲーム・ガジェットが好きです。
						<br />
						42 Tokyoにて2026年2月に実施された入学試験「Piscine」に合格。同年4月入学。
					</p>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3">スキルセット</h2>
				<div className="flex flex-wrap gap-2">
					{['C', 'TypeScript', 'React', 'Next.js', 'PHP', 'SQL'].map((skill) => (
						<span
							key={skill}
							className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
						>
							{skill}
						</span>
					))}
				</div>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3">このブログについて</h2>
				<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
					未来の自分のため、42 Tokyoでの学習記録をひっそり蓄積するのが主な目的です。
					<br />
					プレイしたゲームや購入したガジェットなどの趣味の話も気が向けば。
				</p>
			</section>
		</div>
	);
}
