# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (Vite)
- `npm run build` — production build
- `npm run preview` — preview production build locally
- `npm run check` — run svelte-check + TypeScript type checking
- `npm run check:watch` — type checking in watch mode

No test framework or linter is currently configured.

## Architecture

SvelteKit 2 app using Svelte 5 (with runes enabled), TypeScript in strict mode, and Vite 7.

- **Routing**: file-based routing in `src/routes/` using SvelteKit conventions (`+page.svelte`, `+layout.svelte`, `+server.ts`, etc.)
- **Shared code**: `src/lib/` — importable via `$lib` alias
- **Static assets**: `static/` for public files, `src/lib/assets/` for build-processed assets
- **Deployment**: uses `@sveltejs/adapter-auto` for platform-agnostic deployment (Vercel, Netlify, Cloudflare, etc.)
- **Module format**: ESM (`"type": "module"` in package.json)
- **Engine strict**: `.npmrc` enforces Node.js version constraints
