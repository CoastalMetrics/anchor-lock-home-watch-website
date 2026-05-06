# Anchor Lock Home Watch

Marketing site for **Anchor Lock Home Watch**, a professional home watch service serving Cape Coral, Fort Myers, Matlacha & Pine Island, FL. Owned by Rob Senitza.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | SvelteKit 2, Svelte 5 (runes), TypeScript |
| Styling | Scoped CSS with CSS custom properties (no framework) |
| Hosting | Vercel |
| Analytics | Vercel Analytics |
| Fonts | Google Fonts — Inter (body), Playfair Display (headings) |

---

## Project Structure

```
anchor-lock-home-watch/
├── src/
│   └── routes/
│       ├── +layout.svelte                        # Root layout — global CSS vars, Vercel Analytics
│       └── (marketing)/
│           ├── +page.svelte                      # Marketing homepage (single-page)
│           └── (policy)/
│               ├── +layout.svelte                # Shared header/footer for policy pages
│               ├── privacy/+page.svelte          # Privacy Policy
│               └── terms/+page.svelte            # Terms of Service
├── static/
│   └── images/                                   # Photo assets
└── package.json
```

---

## Pages

### `/` — Marketing Homepage
Single-page site with sections: navigation, hero, services (expandable), photo strip, about (with owner photo), contact form, and footer. Footer links to Privacy Policy and Terms of Service.

### `/privacy` — Privacy Policy
Effective 05/01/2026.

### `/terms` — Terms of Service
Effective 05/01/2026.

---

## Local Development

```bash
npm install
npm run dev        # Start dev server at localhost:5173
npm run check      # TypeScript + svelte-check type checking
npm run build      # Production build
npm run preview    # Preview production build locally
```

---

## Deployment

Deploys automatically to **Vercel** on push to `main`. No manual step needed.

---

## Contact Info (on site)

- Phone: 239-990-7090
- Email: Rob@AnchorLockHomeWatch.com
- Service area: Cape Coral · Fort Myers · Matlacha · Pine Island
