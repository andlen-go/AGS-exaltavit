# Exaltavit — Concert-first static site

One-page campaign for **Exaltavit**, a free choral concert by **Avant Garde Singers** on **October 17, 2026** at the **National Shrine and Parish of Our Lady of Aranzazu, San Mateo, Rizal**.

Stack: **Vite + React + TypeScript + Tailwind**. Fully static. No database, auth, or payment processors. Gifts, keepsake orders, RSVPs, and partnerships use **mailto** with **Open email draft** / **Copy message**.

Live: [https://exaltavit.netlify.app/](https://exaltavit.netlify.app/)

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

## Page order

1. Concert invitation (hero)
2. Dedication to Nuestra Señora de Aranzazu
3. Performance preview (hidden until video URLs are set)
4. The Voices of Exaltavit
5. The Repertoire
6. Exaltavit keepsakes
7. Patronage and partnerships
8. Plan your visit
9. Acknowledgments / FAQ footer

## Configure

Edit `src/config/event.ts`:

| Field | Purpose |
| --- | --- |
| `organizerEmail` / `privacyContact` | Inbox (currently `avantgardesingers@gmail.com` from FB About) |
| `dedication` | Marian dedication copy |
| `repertoire[]` | Approved titles; leave `composer` blank until supplied |
| `voices[]` | Roster with `slug` for `#voice-{slug}` anchors — no invented names |
| `previewVideos[]` | Click-to-play URLs; section hidden when empty |
| `media.hero` / `ensemble` / `patroness` | Photo slots; labeled placeholders until `src` is set |
| `gcash.*` | All three required or GCash panel stays quiet |
| `mapUrl` / `timeLabel` | Directions and concert time |
| `products` | Keepsakes; `featured` for shirt/tote row |
| `thankYouList` | Opt-in public names only |

Unfinished config is **hidden from visitors** (no “not configured” essays). Details for organizers stay in this README and the delivery note.

Optional share URL (no trailing slash):

```bash
VITE_SITE_URL=https://exaltavit.netlify.app
```

## Organizer checklist

1. Supply hero performance, ensemble, patroness, and singer portraits (Facebook page blocks automated fetch).
2. Add composer credits when known — do not invent them.
3. Fill GCash name, number, and QR under `public/`.
4. Publish `timeLabel` and `mapUrl` when confirmed.
5. Confirm keepsake pickup / deadline / size chart.
6. Add `voices[]` entries with real names and optional bios.
7. Watch inbox for `[Exaltavit Gift]`, `[Exaltavit Merch]`, `[Exaltavit RSVP]`, `[Exaltavit Partner]` + Record ID.
8. Add thank-you names only with recognition consent.

## Brand

Ivory `#F7F2E9` · Navy `#101F32` · Gold `#A5783E` · Content max ~1180px · Body 16–18px · Asia/Manila · PHP
