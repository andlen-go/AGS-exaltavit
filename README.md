# Exaltavit — Concert-first static site

One-page campaign for **Exaltavit**, a free choral concert by **Avant Garde Singers** on **October 17, 2026** at the **National Shrine and Parish of Our Lady of Aranzazu, San Mateo, Rizal**.

Stack: **Vite + React + TypeScript + Tailwind**. Fully static. No database, auth, or payment processors. Gifts, keepsake orders, RSVPs, and partnerships use **mailto** with **Open email draft** / **Copy message**.

## Environments

| Environment | URL | How it updates |
| --- | --- | --- |
| **Local** | [http://dev.exaltavit.com:5179/](http://dev.exaltavit.com:5179/) | `npm run dev` on your Windows/WSL clone |
| **Staging** | [https://exaltavit.netlify.app/](https://exaltavit.netlify.app/) | Push or merge to `main` (Netlify production branch) |

Full Windows + WSL walkthrough: see the Project doc `docs/local-setup-guide.md` (Andlen setup guide).

## Run locally (Windows + WSL)

Clone path (Windows): `C:\Users\ARGO\Projects\AGS-exaltavit`  
WSL path: `/mnt/c/Users/ARGO/Projects/AGS-exaltavit`

1. Map the hostname in the Windows hosts file (`C:\Windows\System32\drivers\etc\hosts`):

   ```
   127.0.0.1  dev.exaltavit.com
   ```

2. In WSL, install and start the app:

   ```bash
   cd /mnt/c/Users/ARGO/Projects/AGS-exaltavit
   npm install
   npm run dev
   ```

3. Create `.env.local` (not committed):

   ```
   VITE_SITE_URL=http://dev.exaltavit.com:5179
   ```

4. Open [http://dev.exaltavit.com:5179/](http://dev.exaltavit.com:5179/)

Vite is configured for `host: true`, port **5179**, `strictPort: true`, and `allowedHosts: ['dev.exaltavit.com', 'localhost']`.

```bash
npm run build
npm run preview
```

## Staging deploy (Netlify)

Staging is the existing Netlify site at **https://exaltavit.netlify.app**.

1. Develop on a feature branch locally.
2. Push the branch and open/merge a PR into `main`, **or** push `main` when you intend to update staging.
3. Netlify rebuilds from `main` (production branch).

Set this Netlify environment variable (Site settings → Environment variables):

```
VITE_SITE_URL=https://exaltavit.netlify.app
```

## Page order

1. Major partners strip (under header)
2. Concert invitation (hero)
3. Dedication to Nuestra Señora de Aranzazu
4. Performance preview (hidden until video URLs are set)
5. The Voices of Exaltavit (section filter chips)
6. The Repertoire (draft blurbs)
7. Exaltavit keepsakes
8. Patronage and partnerships
9. Plan your visit
10. Acknowledgments / FAQ footer

Sticky: desktop **Support Exaltavit** chip + major-partners rail; mobile **Attend · Keepsakes · Support** bar.

## Configure

Edit `src/config/event.ts`:

| Field | Purpose |
| --- | --- |
| `majorPartners` / `organizationSponsors` / `individualSponsors` | Acknowledgments tiers; set `sample: true` for demos |
| `organizerEmail` / `privacyContact` | Inbox (currently `avantgardesingers@gmail.com`) |
| `dedication` | Marian dedication copy |
| `repertoire[]` | Titles + optional `composer` / draft `blurb` |
| `voices[]` | Roster with `slug` for `#voice-{slug}`; singers use `section` |
| `voicesSampleNote` | UI banner when roster is demo |
| `previewVideos[]` | Click-to-play URLs; section hidden when empty |
| `media.hero` / `ensemble` / `patroness` | Photo slots; optional `credit` |
| `patronageLead` / `patronageValuePoints` | Support copy (experience + organization value) |
| `gcash.*` | All three required or GCash panel stays quiet |
| `mapUrl` / `timeLabel` | Directions and concert time |
| `products` | Keepsakes; `featured` for shirt/tote row |

Optional share URL (no trailing slash) — see `.env.example` for local vs staging values.

## Organizer checklist

1. Replace sample major/org/individual sponsors with confirmed, consented names (`sample: false` or omit).
2. Replace sample roster (~30 singers + production + leadership) with confirmed names; keep `#voice-{slug}` anchors.
3. Supply choir performance / ensemble portraits (hero currently uses a temporary Wikimedia shrine facade).
4. Confirm composers; keep or revise draft repertoire blurbs.
5. Fill GCash name, number, and QR under `public/`.
6. Publish `timeLabel` and `mapUrl` when confirmed.
7. Confirm keepsake pickup / deadline / size chart.
8. Watch inbox for `[Exaltavit Gift]`, `[Exaltavit Merch]`, `[Exaltavit RSVP]`, `[Exaltavit Partner]` + Record ID.

## Brand

Ivory `#F7F2E9` · Navy `#101F32` · Gold `#A5783E` · Content max ~1180px · Body 16–18px · Asia/Manila · PHP
