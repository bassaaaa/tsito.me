import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { SITE_NAME } from '@/constant';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
    return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    const fontData = await fetch(
        'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap',
    )
        .then((res) => res.text())
        .then((css) => {
            const url = css.match(/src: url\((.+?)\) format/)?.[1];
            if (!url) throw new Error('Font URL not found');
            return fetch(url);
        })
        .then((res) => res.arrayBuffer());

    const iconData = await readFile(join(process.cwd(), 'public', 'my_icon.png'));
    const iconBase64 = `data:image/png;base64,${iconData.toString('base64')}`;

    const title = post?.title ?? 'Page Not Found';
    const date = post?.date ?? '';

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '60px 72px',
                    background: '#0f172a',
                    fontFamily: '"Noto Sans JP"',
                }}
            >
                {/* Top: date */}
                {date && (
                    <div style={{ fontSize: '36px', color: '#64748b' }}>
                        {date}
                    </div>
                )}

                {/* Center: title */}
                <div
                    style={{
                        display: 'flex',
                        flex: 1,
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            fontSize: title.length > 30 ? '42px' : '52px',
                            fontWeight: 700,
                            color: '#f1f5f9',
                            lineHeight: 1.4,
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                        }}
                    >
                        {title}
                    </div>
                </div>

                {/* Bottom: site name */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '14px',
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={iconBase64}
                        alt=""
                        width="48"
                        height="48"
                        style={{ borderRadius: '50%' }}
                    />
                    <div
                        style={{
                            fontSize: '36px',
                            color: '#818cf8',
                            fontWeight: 700,
                        }}
                    >
                        {SITE_NAME}
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: 'Noto Sans JP',
                    data: fontData,
                    weight: 700,
                    style: 'normal',
                },
            ],
        },
    );
}
