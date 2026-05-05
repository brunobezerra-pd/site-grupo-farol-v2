# PRD.md — Grupo Farol Website v2

> Research and context artifact generated prior to technical specification.  
> Source: consolidated discovery session. Reference for SPEC.md generation.

---

## 1. Project Context

Full rewrite of the institutional website for Grupo Farol (largest creator agency in Latin America) using a modern stack. The previous project (HTML + Tailwind CLI + Vercel Serverless + Supabase) is live at `site-grupo-farol.vercel.app` and serves as business logic reference.

**Reference repository:** https://github.com/brunobezerra-pd/site-grupo-farol  
**New repository:** https://github.com/brunobezerra-pd/site-grupo-farol-v2

---

## 2. Defined Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Rich Text | Tiptap |
| Backend/DB | Supabase (Postgres + Auth + Storage) |
| Deploy | Vercel (ISR + Cron) |

---

## 3. Rendering Strategy

- **Public site (`/` and `/casting`):** ISR with `revalidate: 60`. Pages are statically generated and automatically revalidated after 60 seconds.
- **Admin (`/admin/*`):** Client-side rendering. Protected by Supabase Auth. No sensitive data exposed at build time.
- **Rationale:** Institutional content changes infrequently. A delay of up to 60s between saving in the admin and reflecting on the public site is acceptable. Maximum performance and SEO for visitors.

---

## 4. Public Pages

### 4.1 Home (`/`)
Sections in order:
1. Header/Nav
2. Hero
3. About (big numbers)
4. Creators (category tags)
5. Talents Marquee (auto-loop)
6. How We Work (4 cards)
7. Partners (logo grid)
8. Final CTA
9. Footer (includes configurable ads area)

### 4.2 Casting (`/casting`)
- Grid of all registered talents
- Filter by category (dynamically extracted from data)
- Google-style pagination: first, previous, page numbers, next, last
- No individual talent page (future scope)

---

## 5. Admin (`/admin`)

### 5.1 Authentication
- Supabase Auth with email + password
- Domain whitelist: `@grupofarol.com` and `@br-mediagroup.com`
- Invite flow: operator adds email in admin → system validates domain → sends invite via Supabase Auth → user sets password and gains access
- All users have the same access level (no roles for now)

### 5.2 Admin Tabs

**Hero**
- Toggle: show/hide hero button
- Field: button label
- Field: button link/URL

**Talents**
- Individual talent CRUD (name, photo, categories, featured flag, + extra spreadsheet fields saved but not displayed)
- Spreadsheet import (`.xlsx` or `.csv`):
  - Required fields validated: `name`, `photo_url`, `categories`
  - Extra fields saved to database for future use
  - Automatic image download via Google Drive URL
  - If download fails: talent imported with `photo_pending = true` flag + clear error message explaining how to make the Drive image public
- Marquee configuration:
  - Number field: how many talents to display (e.g. 5, 10, 20)
  - Selection logic: prioritizes talents with `featured = true`, fills remaining slots by `created_at ASC`

**Partners**
- Logo upload (image)
- Logo removal

**Images (Slots)**
- Image slots mapped from Figma
- Upload per slot
- Toggle: show/hide slot (when hidden, even the placeholder is not rendered)

**CTA / Contact**
- Field: contact button label
- Field: contact button link/URL
- Toggle: show/hide "Meet all talents" button

**SEO**
- Field: page title
- Field: meta description
- Field: og:title
- Field: og:description
- Upload: og:image

**Scripts** *(separate tab with visible risk warning)*
- Textarea: code to inject in `<head>` (GTM, Search Console, pixels)
- Textarea: code to inject in `<body>`
- Textarea: code to inject in the footer ads area (pre-defined space from Figma)

**Users**
- List of users with access
- Form: invite user by email (validates domain before sending invite)
- Action: remove user access

---

## 6. Database Schema (Supabase)

### Table: `talents`
```
id                  uuid PK
name                text NOT NULL
description         text
photo_url           text
photo_pending       boolean DEFAULT false
instagram_url       text
tiktok_url          text
featured            boolean DEFAULT false
categories          text[]
followers_range     text
civil_status        text
has_children        boolean
dietary_restriction text
has_pet             text
location            text
birth_date          date
gender              text
lgbtqia             boolean
of_age              boolean
created_at          timestamptz DEFAULT now()
```

### Table: `partners`
```
id          uuid PK
logo_url    text NOT NULL
sort_order  integer
created_at  timestamptz DEFAULT now()
```

### Table: `image_slots`
```
id          uuid PK
slot_key    text UNIQUE NOT NULL  -- e.g. 'about_image', 'hero_bg'
image_url   text
enabled     boolean DEFAULT true
label       text  -- human-readable name for the admin UI
created_at  timestamptz DEFAULT now()
```

### Table: `site_settings`
Key/value pattern. One row per setting.
```
id          uuid PK
key         text UNIQUE NOT NULL
value       text
updated_at  timestamptz DEFAULT now()
```

**Expected keys in `site_settings`:**
- `hero_button_enabled`
- `hero_button_label`
- `hero_button_url`
- `marquee_count`
- `talents_button_enabled`
- `contact_button_label`
- `contact_button_url`
- `seo_title`
- `seo_description`
- `og_title`
- `og_description`
- `og_image_url`
- `script_head`
- `script_body`
- `script_footer`

---

## 7. Infrastructure

### Keepalive Cron
- Route: `/api/keepalive`
- Schedule: `0 9 * * *` (9:00 UTC daily)
- Purpose: keep Supabase free tier active (prevents pause due to inactivity)
- Authenticated via `CRON_SECRET` header

### SEO / Robots
- `/admin/*` → `X-Robots-Tag: noindex, nofollow`
- Automatic sitemap via Next.js (`/sitemap.xml`)
- `robots.txt` allowing indexing of the public site, blocking `/admin`

---

## 8. Fonts

| Font | Type | Source |
|---|---|---|
| Agharti | Variable | `/public/fonts` (licensed) |
| Casual Human Regular | Regular | `/public/fonts` (licensed) |
| Casual Human Bold | Bold | `/public/fonts` (licensed) |
| Foun | Regular | `/public/fonts` (licensed) |
| Poppins | Sans-serif | `next/font/google` |
| PT Serif | Serif | `next/font/google` |

---

## 9. Design

- 3 Figma breakpoints: Desktop, Tablet, Mobile
- Frontend built via Figma MCP
- Figma fidelity takes priority over WCAG
- Color tokens extracted from Figma

---

## 10. Reference Files from Previous Project

| File | What to reuse |
|---|---|
| `api/keepalive.js` | Cron logic |
| `api/talents.js` | Supabase talent queries |
| `api/partners.js` | Supabase partner queries |
| `api/settings.js` | site_settings key/value pattern |
| `vercel.json` | Cron, headers and rewrites config |
| `admin/*.js` | Supabase Storage upload logic |

---

## 11. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=
ALLOWED_DOMAINS=grupofarol.com,br-mediagroup.com
```
