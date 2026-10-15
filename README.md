# Andhra Roots Kitchen (Chettu Kinda Pesarattu)

A bilingual English/Telugu restaurant website for Vizag. It includes a public menu, owner-managed testimonials, optional live Google reviews, team profiles, and a password-protected admin dashboard. Neon Postgres stores records and Cloudflare R2 stores uploaded images.

## Local development

Requirements: Node.js 22.13+ and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`. The owner dashboard is at `/admin`. Without `DATABASE_URL`, the public page shows bundled sample menu/team content while admin writes return `503`; real data is never silently replaced with mock storage.

## Vercel environment variables

In Vercel, open **Project → Settings → Environment Variables**, add the variables below for Production (and Preview if needed), save, and redeploy. Never commit `.env.local` or send credentials in chat.

### 1. Neon Postgres

1. Create a Neon project and database.
2. In Neon’s **Connection Details**, enable the pooled connection option and copy the connection string.
3. Add it in Vercel as `DATABASE_URL`.
4. Open Neon’s SQL Editor, review and run `drizzle-postgres/0000_dear_karma.sql` once against the intended database. It creates `menu_items`, `team_members`, and `testimonials`.

### 2. Admin password

Set:

- `ADMIN_PASSWORD`: a unique random password of at least 16 characters, stored only in Vercel; or
- `ADMIN_PASSWORD_HASH`: the preferred PBKDF2-SHA256 value in `iterations.salt.hash` format.
- `ADMIN_SESSION_SECRET`: a separate random secret, for example from `openssl rand -base64 48`.

If both password options are present, `ADMIN_PASSWORD` is used. Do not place the real password in `.env.example` or source code. Authentication is verified on the server and creates a signed, 12-hour HttpOnly, SameSite cookie.

### 3. Cloudflare R2 image uploads

1. In Cloudflare, open **Storage & databases → R2 → Overview** and create a bucket.
2. Select **Manage in API Tokens** and create an **Object Read & Write** token restricted to that bucket.
3. Copy the Access Key ID and Secret Access Key immediately—the secret cannot be viewed again.
4. Add these values in Vercel:

```text
CLOUDFLARE_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

The account ID appears in the R2 endpoint: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`. Images are limited to JPG, PNG, WebP, or GIF files up to 5 MB and are accessed through the application’s image route.

### 4. Optional Google reviews

Add `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` to show live Google reviews alongside manually managed testimonials. Without them, owner-created testimonials continue to work normally.

### 5. Public URL and SEO

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS custom domain without a trailing slash. The application includes English/Telugu metadata, canonical URLs, Open Graph metadata, Restaurant JSON-LD, `robots.txt`, and `sitemap.xml`. Replace the placeholder address, telephone, location and hours with verified Google Business Profile details before launch.

## Owner dashboard

After signing in at `/admin`, the owner can:

- Add, edit, price, order, publish/hide, and delete menu items.
- Upload, replace, and remove food photos in R2.
- Add and edit chef/team profiles with photos.
- Add bilingual testimonials with a 1–5 rating, source, optional customer photo, display order, and published/hidden status.
- Optionally connect Google Places instead of uploading review screenshots.

## Deploy to Vercel

Import the repository with the project root set to the repository root and keep the framework preset as **Next.js**. `vercel.json` runs a locked install and standard Next.js webpack build, producing `.next/routes-manifest.json`.

```bash
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

Environment-variable changes affect only new Vercel deployments, so redeploy after adding or rotating a value.
