# Vilim Puclin — Linktree-style site

Astro + Tailwind + Decap CMS, deployed on Netlify. Single page with a stack of link cards, a faded S1 chrome logo and big "VILIM PUCLIN FITNESS COACH" wordmark in the background, and an auto-generated Open Graph image for link previews.

## Local dev

```bash
npm install
npm run dev           # http://localhost:4321
npm run build         # outputs to dist/
npm run preview       # serves dist/
```

## Required assets (drop in before first build)

- `public/assets/s1-logo.png` — the silver S1 chrome logo (foreground **and** background use this file).
- `public/assets/favicon.png` — favicon (can be a small version of the logo).
- `public/assets/uploads/thumb-skool.png`
- `public/assets/uploads/thumb-coaching.png`
- `public/assets/uploads/thumb-mentorship.png`

Any missing thumbnail just hides its image via `onerror`; the card still works. Editors can replace all of these from the CMS.

## Editing content (CMS)

After deploy, go to `https://<your-site>/admin/` and log in with Netlify Identity.

- **Site settings → Hero & SEO**: edit hero title, subtitle, tagline, Instagram handle, and share-card title/description. These changes flow through to the page *and* the `/og.png` share preview on the next build.
- **Link cards**: add, remove, reorder, or update each card. Fields: `order` (lower = higher on page), `label`, `url`, `thumbnail`, optional `badge`.

Each save commits to `main`, which triggers a Netlify rebuild.

## Netlify setup (one-time)

1. Push this repo to GitHub (`main` branch).
2. Netlify → **Add new site → Import from Git** → select the repo.
3. Build command `npm run build`, publish directory `dist` (already set in `netlify.toml`).
4. **Site settings → Identity → Enable Identity.**
   - Registration: **Invite only**.
   - **Services → Git Gateway → Enable Git Gateway.**
5. **Identity → Invite users** → invite the editor's email.
6. Editor accepts the invite, sets a password, then visits `/admin/` to log in.

## Open Graph / share preview

`src/pages/og.png.ts` renders a 1200×630 PNG at build time using Satori + resvg. It reads the current `settings/site.json` and embeds the S1 logo, so the share preview always matches the live hero.

Verify after deploy with <https://www.opengraph.xyz/> or paste the URL into a WhatsApp/Instagram DM.

## File map

```
public/
  admin/            Decap CMS shell + config
  assets/           Logo, favicon, uploaded CMS images
src/
  content/          Astro content collections (settings + links)
  components/       BackgroundLogo, Hero, LinkCard, InstagramFooter
  layouts/Base      <head>, OG meta
  pages/
    index.astro     The page
    og.png.ts       Build-time OG image
```
