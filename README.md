# Exaltavit — Static Concert Site

One-page campaign site for **Exaltavit**, a free choral concert by **Avant Garde Singers** on **October 17, 2026** at the **National Shrine and Parish of Our Lady of Aranzazu, San Mateo, Rizal**.

Stack: **Vite + React + TypeScript + Tailwind**. Fully static. No database, auth, or third-party forms/payments. Donations, merch pre-orders, RSVPs, and sponsorships use **mailto** plus **copy-to-clipboard**.

## Run locally

```bash
npm install
npm run dev
```

Dev server: [http://127.0.0.1:4719](http://127.0.0.1:4719)

```bash
npm run build
npm run preview
```

## Deploy

Production: [https://exaltavit.netlify.app/](https://exaltavit.netlify.app/)

Build output is `dist/`. Netlify builds with `npm run build` and publishes `dist/` (see `netlify.toml`). You can also deploy that folder to Vercel, GitHub Pages, or any static host.

Optional public share URL (used by “Copy page link”). Set in Netlify env or local `.env` — **no trailing slash**:

```bash
# .env (optional)
VITE_SITE_URL=https://exaltavit.netlify.app
```

## Configure content

Edit `src/config/event.ts`:

| Field | Purpose |
| --- | --- |
| `organizerEmail` | Inbox for all mailto flows (replace `@example.com` before launch) |
| `timeLabel` | Concert time; leave `null` for “Time to be announced” |
| `gcash.*` | Account name, number, QR path — **all three required** or GCash UI stays disabled |
| `mapUrl` | Directions link under Plan your visit |
| `products` / `preorderEnabled` | Merch catalog and whether checkout is offered |
| `sizeChartReady` | Flip to `true` when a size guide is published |
| `pickupCopy` | Fulfillment instructions shown at checkout |
| `budget.goalPhp` / `raisedPhp` | Optional static progress; both required to show totals |
| `thankYouList` | Opt-in public names only |
| `choirIntro` | Meet-the-choir copy |

Feature gates are **derived from filled fields**, not a single “enable” checkbox.

## Organizer inbox checklist

1. Replace `organizerEmail` / `privacyContact` with the real AGS inbox.
2. Fill GCash name, number, and add a QR image under `public/` before promoting donations.
3. Publish concert **time** (`timeLabel`) when confirmed.
4. Add `mapUrl` for directions.
5. Confirm merch **pickup** details and size chart; set `sizeChartReady` accordingly.
6. Watch inbox for subjects prefixed `[Exaltavit Gift]`, `[Exaltavit Merch]`, `[Exaltavit RSVP]`, `[Exaltavit Sponsor]` — match on the **Record ID**.
7. Reply to confirm payment/pickup offline; the site never verifies transfers.
8. Add thank-you names only when donors opted in.
9. Set `VITE_SITE_URL` on deploy for reliable share links.
10. Keep Facebook page linked: https://www.facebook.com/AGSingers

## Placeholders / launch blockers

- Organizer email is still a placeholder (`@example.com`).
- GCash transfer panel is intentionally disabled until all three fields are filled.
- Concert time is TBA.
- Map / directions link empty.
- Size chart not ready; pickup copy is provisional.
- Meet-the-choir bio is a short placeholder; artwork stands in for choir photos.
- Thank-you list empty (invite-first-supporters state).
- Budget progress hidden until static numbers are entered (never invent totals).

## Brand

Ivory `#F7F2E9` · Navy `#101F32` · Gold `#A5783E` · Asia/Manila · PHP
