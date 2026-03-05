# tsito.dev

個人技術ブログ。Next.js App Router + Markdown で構築。

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **gray-matter** — Markdown frontmatter パース
- **unified / remark / rehype / rehype-pretty-code** — Markdown → HTML 変換・シンタックスハイライト
- **next-themes** — ダークモード

## Getting Started

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認。

## 記事の追加

`content/<カテゴリ>/<slug>.md` にファイルを作成し、frontmatter を記述する。

```md
---
title: '記事タイトル'
date: '2026-01-01'
tags: ['tag1', 'tag2']
category: 'カテゴリ'
published: true
---

本文...
```

## Project Structure

```bash
app/           # ページ & レイアウト
components/    # Header, Footer, PostCard, TagList, ThemeToggle
lib/           # posts.ts, mdx.ts
types/         # post.ts
content/       # .md ファイル
public/        # 静的ファイル
```
