import type { Metadata } from 'next';
import Image from 'next/image';
import { SITE_NAME } from '../../constant';

export const metadata: Metadata = {
	title: `About | ${SITE_NAME}`,
	description: 'このブログについて',
};

export default function AboutPage() {
	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
			<div className="flex flex-col items-center text-center mb-14">
				<Image
					src="/my_icon_bg_white.png"
					alt="アイコン"
					width={96}
					height={96}
					className="rounded-full ring-2 ring-(--accent) ring-offset-2 ring-offset-background mb-5"
				/>
				<h1 className="text-2xl font-bold mb-1">tsito</h1>
			</div>

			<div className="space-y-10">
				<section>
					<h2 className="text-xs font-semibold uppercase tracking-widest text-(--muted) mb-4">
						Profile
					</h2>
					<p className="text-foreground leading-relaxed">
						1996年生まれ、広島県出身。 都内でエンジニアとして働いています。
						ゲーム・ガジェットが好き。 42 Tokyo 2026-02 Piscine → 2026-04 KickOff。
					</p>
				</section>

				<section className="border-t border-(--border) pt-10">
					<h2 className="text-xs font-semibold uppercase tracking-widest text-(--muted) mb-4">
						Skills
					</h2>
					<div className="flex flex-wrap gap-2">
						{['C', 'TypeScript', 'React', 'Next.js', 'PHP', 'SQL'].map((skill) => (
							<span
								key={skill}
								className="px-3 py-1 text-sm rounded-md border border-(--border) bg-(--surface) text-foreground"
							>
								{skill}
							</span>
						))}
					</div>
				</section>

				<section className="border-t border-(--border) pt-10">
					<h2 className="text-xs font-semibold uppercase tracking-widest text-(--muted) mb-4">
						This Blog
					</h2>
					<p className="text-(--foreground) leading-relaxed">
						未来の自分のため、42 Tokyoでの学習記録をひっそり蓄積するのが主な目的です。
						プレイしたゲームや購入したガジェットなどの趣味の話も気が向けば。
					</p>
				</section>
			</div>
		</div>
	);
}
