# my blog — 設計ドキュメント

> Version 1.0 | 2026-03-04

---

## 1. 概要

### 1.1 目的

42 Schoolでの学習記録、趣味のガジェットやゲームのレビュー、その他の技術学習を記録する個人ブログ。
自分の学びを構造化してアウトプットすることが主目的。将来的に転職活動時のポートフォリオとしても活用できる形を目指す。

### 1.2 運営方針

- 基本的にひっそり運営（SNS拡散やSEO対策は行わない）
- 自分のペースで無理なく更新する
- 記事の質よりも「記録を残すこと」を優先する
- ポートフォリオとして見せる際に、技術力・学習姿勢が伝わる構成にする

### 1.3 コンテンツカテゴリ

| カテゴリ | 内容例 |
| --- | --- |
| 42 Tokyo | Piscine体験記、課題解説、プロジェクト振り返り |
| 趣味 | ゲームレビュー、ガジェット購入記など |
| その他学習 | Rust学習、Web技術、ツール紹介 |

---

## 2. 要件定義

### 2.1 機能要件

**コア機能（Phase 1）**

1. ブログ記事の表示（一覧・詳細）
2. カテゴリ・タグによるフィルタリング
3. MarkdownベースのコンテンツChapter管理（MDX推奨）
4. コードブロックのシンタックスハイライト
5. レスポンシブデザイン（モバイル対応）
6. ダークモード対応

**追加機能（Phase 2）**

1. 記事内検索機能
2. ページネーション
3. 関連記事の提案
4. About ページ充実（スキルセット、タイムライン等）

### 2.2 非機能要件

| 項目 | 要件 |
| --- | --- |
| パフォーマンス | Lighthouse スコア 90 以上、初回読み込み 2 秒以内 |
| アクセシビリティ | セマンティックHTML、キーボードナビゲーション対応 |
| 保守性 | 記事追加はMarkdownファイルを置くだけで反映されること |
| ホスティング | Vercelでのデプロイ、GitHub連携による自動デプロイ |

---

## 3. 技術スタック

| レイヤー | 技術 | 選定理由 |
| --- | --- | --- |
| フレームワーク | Next.js 14+ (App Router) | RSC対応、静的生成、ファイルベースルーティング |
| 言語 | TypeScript | 型安全性、開発体験の向上 |
| コンテンツ | MDX (contentlayer or next-mdx-remote) | Markdown + JSXコンポーネントの埋め込みが可能 |
| スタイリング | Tailwind CSS | ユーティリティファースト、ダークモード対応が容易 |
| コードハイライト | Shiki or Prism | C/Rust等のシンタックスハイライト対応 |
| ホスティング | Vercel | Next.jsとの親和性、無料枠で十分な個人ブログ運用 |
| バージョン管理 | Git + GitHub | ソースコード管理、Vercel連携 |

---

## 4. サイト設計

### 4.1 ページ構成

| ページ | パス | 説明 |
| --- | --- | --- |
| トップ | `/` | 最新記事一覧、プロフィール概要、カテゴリナビゲーション |
| 記事一覧 | `/blog` | 全記事一覧、カテゴリ・タグフィルター、ページネーション |
| 記事詳細 | `/blog/[slug]` | 個別記事ページ、目次、関連記事 |
| カテゴリ | `/blog/category/[cat]` | カテゴリ別記事一覧 |
| タグ | `/blog/tag/[tag]` | タグ別記事一覧 |
| About | `/about` | 自己紹介、スキルセット、SNSリンク |

### 4.2 UIデザイン方針

- ミニマルでクリーンなデザイン（読みやすさ優先）
- ダークモード: システム設定に追従 + トグルボタン
- コードブロック: コピーボタン付き、ファイル名表示対応
- タイポグラフィ: 日本語フォント（Noto Sans JP等）+ 英語フォントの併用
- 画像: `next/image` で最適化、サムネイル自動生成

---

## 5. ディレクトリ構成

Next.js App Routerベースの推奨ディレクトリ構成。

```bash
my-blog/
├── src/
│   ├── app/                          # App Router ルート
│   │   ├── layout.tsx                # ルートレイアウト（ヘッダー・フッター）
│   │   ├── page.tsx                  # トップページ
│   │   ├── about/page.tsx            # Aboutページ
│   │   └── blog/
│   │       ├── page.tsx              # 記事一覧
│   │       ├── [slug]/page.tsx       # 記事詳細
│   │       ├── category/[cat]/page.tsx   # カテゴリ別一覧
│   │       └── tag/[tag]/page.tsx    # タグ別一覧
│   ├── components/                   # 再利用可能なコンポーネント
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PostCard.tsx              # 記事カードコンポーネント
│   │   ├── CodeBlock.tsx             # コードブロック（シンタックスハイライト付き）
│   │   ├── TableOfContents.tsx       # 目次コンポーネント
│   │   ├── TagList.tsx               # タグ一覧表示
│   │   └── ThemeToggle.tsx           # ダークモード切り替え
│   ├── lib/                          # ユーティリティ関数
│   │   ├── posts.ts                  # 記事データの取得・処理
│   │   ├── mdx.ts                    # MDXパーサー設定
│   │   └── utils.ts                  # 共通ユーティリティ
│   └── styles/
│       └── globals.css               # Tailwind + カスタムスタイル
├── content/                          # 記事データ（ソースコードと分離）
│   ├── 42-tokyo/                    # 42Tokyo関連記事
│   ├── hobby/                        # 趣味・レビュー記事
│   └── learning/                     # その他学習記事
├── public/
│   └── images/                       # 記事用画像
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 5.1 記事ファイルの構造 (Frontmatter)

各MDXファイルの先頭に以下のfrontmatterを記載する。

```yaml
---
title: "記事タイトル"
date: 2026-03-04
category: "42Tokyo" | "hobby" | "learning"
tags: ["C", "linked-list", "42"]
description: "記事の説明文（80文字以内推奨）"
published: true
thumbnail: "/images/xxx.png"  # 任意
---
```

---

## 6. アーキテクチャ

### 6.1 データフロー

本ブログは完全な静的サイトとしてビルドされる。データベースは使用せず、全てのコンテンツはMarkdownファイルからビルド時に生成される。

1. `content/` ディレクトリにMDXファイルを配置
2. `lib/posts.ts` がファイルシステムから記事データを取得
3. Next.jsがビルド時に静的HTMLを生成 (SSG)
4. Vercelへデプロイ、CDN経由で配信

### 6.2 デプロイフロー

GitHubのmainブランチへのpushをトリガーに、Vercelが自動でビルド・デプロイを実行する。

- **開発環境:** `localhost:3000` (`next dev`)
- **プレビュー:** Vercel Preview Deployment（PRごと）
- **本番:** Vercel Production（mainブランチ）

### 6.3 コンポーネント設計方針

- Server Componentsをデフォルトで使用、Client Componentsは最小限に
- インタラクティブな部分のみ `'use client'` を付与（ThemeToggle、検索UI等）
- コンポーネントは単一責任原則に従う
- 型定義は `types/` または各ファイル内で管理

---

## 7. TODOリスト

### Phase 1: MVP（最小構成）

| # | タスク | 優先度 | ステータス |
| --- | --- | --- | --- |
| 1 | Next.jsプロジェクト初期セットアップ (TypeScript + Tailwind) | 高 | TODO |
| 2 | ルートレイアウト（Header / Footer）作成 | 高 | TODO |
| 3 | MDXコンテンツ基盤構築 (frontmatterパーサー) | 高 | TODO |
| 4 | トップページ（最新記事一覧）実装 | 高 | TODO |
| 5 | 記事詳細ページ実装 | 高 | TODO |
| 6 | コードブロックコンポーネント（シンタックスハイライト） | 高 | TODO |
| 7 | ダークモード対応 | 中 | TODO |
| 8 | カテゴリ・タグフィルタリング機能 | 中 | TODO |
| 9 | レスポンシブデザイン調整 | 中 | TODO |
| 10 | Vercelデプロイ設定 | 高 | TODO |

### Phase 2: 拡張機能

| # | タスク | 優先度 | ステータス |
| --- | --- | --- | --- |
| 11 | 検索機能実装 | 中 | TODO |
| 12 | ページネーション実装 | 低 | TODO |
| 13 | 関連記事の自動提案 | 低 | TODO |
| 14 | Aboutページ充実（スキルタイムライン等） | 中 | TODO |
| 15 | アナリティクス導入 (Plausible等) | 低 | TODO |

---

## 8. 命名規則・コーディング規約

### 8.1 ファイル命名

- コンポーネント: PascalCase (`PostCard.tsx`)
- ユーティリティ: camelCase (`posts.ts`)
- 記事ファイル: kebab-case (`my-first-post.mdx`)
- スタイル: kebab-case (`globals.css`)

### 8.2 Gitブランチ戦略

- `main` — 本番環境（保護ブランチ）
- `feature/*` — 新機能開発
- `content/*` — 記事の追加・修正
- `fix/*` — バグ修正

---

## 9. 参考リンク

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MDX](https://mdxjs.com/docs/)
- [Vercel](https://vercel.com/docs)
- [Shiki (Syntax Highlighter)](https://shiki.matsu.io/)
