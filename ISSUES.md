# ISSUES.md — Grupo Farol Website v2

> Atomic tasks derived from SPEC.md.  
> Each issue is a self-contained prompt for Claude Code / Codex.  
> Recommended execution order: follow numbering.  
> Before each issue: start a new session with clean context and attach PRD.md + SPEC.md.

---

## BLOCK 0 — Environment Setup

---

### ISSUE-000: Create .env.local and verify Supabase MCP connection

**Context:** Before any code is written, the local environment must be configured with the correct credentials so the Supabase MCP can operate directly on the database throughout the build process.

**Tasks:**
- Create `.env.local` at the project root with the following variables:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  CRON_SECRET=
  ALLOWED_DOMAINS=grupofarol.com,br-mediagroup.com
  ```
- Prompt me to fill in the values for each variable:
  - `NEXT_PUBLIC_SUPABASE_URL` — found in Supabase dashboard → Project Settings → API → Project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — found in Supabase dashboard → Project Settings → API → anon public key
  - `SUPABASE_SERVICE_ROLE_KEY` — found in Supabase dashboard → Project Settings → API → service_role secret key
  - `CRON_SECRET` — generate a random string (e.g. `openssl rand -base64 32`) and paste it here
- Add `.env.local` to `.gitignore` (confirm it is already there from `create-next-app`, add if missing)
- Create `.env.local.example` with the same keys but empty values — this file IS committed to the repository
- Verify Supabase MCP connection by running a simple test query through the MCP tool. If the connection fails, stop and consult me before continuing

**Wait for my confirmation that all values are filled and the MCP connection is verified before proceeding to ISSUE-001.**

**Acceptance criteria:** `.env.local` exists with all variables filled. `.env.local` is gitignored. Supabase MCP responds successfully to a test query.

---

## BLOCK 1 — Setup & Infrastructure

---

### ISSUE-001: Initialize Next.js project with TypeScript and Tailwind

**Context:** Brand new project. Reference: PRD.md section 2 and SPEC.md Folder Structure.

**Tasks:**
- Create project with `npx create-next-app@latest` using flags: `--typescript`, `--tailwind`, `--app`, `--turbopack` (no `--src-dir`)
- Install shadcn/ui via CLI: `npx shadcn@latest init`
- Configure `next.config.ts`:
  - `images.remotePatterns` for Supabase Storage (`*.supabase.co`) and `drive.google.com`
- Create full folder structure per SPEC.md (empty files with `// TODO` comment)
- Create `vercel.json` per SPEC.md

**Acceptance criteria:** `npm run dev` starts without errors. Folder structure created.

---

### ISSUE-002: Configure fonts

**Context:** 5 fonts total. 4 licensed files in `/public/fonts`, 2 from Google Fonts. Reference: PRD.md section 8, SPEC.md `styles/globals.css` and `app/layout.tsx`.

**Tasks:**
- Create `styles/globals.css` with `@font-face` declarations for: Agharti, CasualHuman-Regular, CasualHuman-Bold, Foun
  - `font-display: swap` on all
  - `src: url('/fonts/[name].woff2') format('woff2')`
- Configure `next/font/google` in `app/layout.tsx` for Poppins and PT Serif
- Add CSS variables in `:root`: `--font-agharti`, `--font-casual-human`, `--font-foun`, `--font-poppins`, `--font-pt-serif`
- Apply font variables to `<html>` via `className`

**Acceptance criteria:** Fonts load without visible FOUT. CSS variables accessible globally.

---

### ISSUE-003: Configure Supabase clients

**Context:** Use `@supabase/ssr` for Next.js App Router. Reference: SPEC.md `lib/supabase/` section.

**Tasks:**
- Install: `npm install @supabase/ssr @supabase/supabase-js`
- Create `lib/supabase/client.ts`: `createBrowserClient` with public env vars
- Create `lib/supabase/server.ts`: `createServerClient` with `next/headers` cookies
- Create `lib/supabase/admin.ts`: `createClient` with `SUPABASE_SERVICE_ROLE_KEY` — add warning comment: "Only use in server actions and API routes. Never import on the client."
- Create `.env.local.example` with all variables listed in PRD.md section 11

**Acceptance criteria:** Each client imports without TypeScript errors.

---

### ISSUE-004: Create database schema

**Context:** 4 tables + RLS + Storage bucket documentation. Reference: PRD.md section 6 and SPEC.md Supabase Setup.

**Tasks:**
- Create `supabase/migrations/001_initial_schema.sql` with:
  - Table `talents` with all columns from PRD.md
  - Table `partners`
  - Table `image_slots` with seed rows for Figma-mapped slots (use placeholder keys for now: `'about_image'`, `'hero_bg'` — update after reading Figma)
  - Table `site_settings` with seed rows for all expected keys from PRD.md (empty values or sensible defaults)
  - RLS policies: public SELECT, authenticated INSERT/UPDATE/DELETE on all tables
  - Enable RLS on all tables
- Create `supabase/storage_setup.md` documenting the 4 buckets to create manually in the Supabase dashboard: `talent-photos`, `partner-logos`, `image-slots`, `og-images` (all public)

**Acceptance criteria:** SQL runs without errors in Supabase SQL Editor. Tables visible in dashboard.

---

### ISSUE-005: Configure authentication middleware

**Context:** Protect all `/admin/*` routes. Reference: SPEC.md `middleware.ts` section.

**Tasks:**
- Create `middleware.ts` at project root
- Use `createServerClient` from `@supabase/ssr` with request/response cookies
- If session is missing and route starts with `/admin` (and is not `/admin/login`): redirect to `/admin/login`
- Refresh session cookies on every request (standard `@supabase/ssr` pattern)
- Set matcher: `'/admin/:path*'`

**Acceptance criteria:** Accessing `/admin` without a session redirects to `/admin/login`. With a valid session, access is granted.

---

### ISSUE-006: Create keepalive and revalidation API routes

**Context:** Cron for Supabase free tier + on-demand ISR revalidation. Reference: SPEC.md `app/api/` section.

**Tasks:**
- Create `app/api/keepalive/route.ts`:
  - GET handler
  - Validate `Authorization: Bearer ${process.env.CRON_SECRET}` header — return 401 if missing/invalid
  - Run `SELECT 1` via Supabase admin client
  - Return `{ ok: true, timestamp: new Date().toISOString() }`
- Create `app/api/revalidate/route.ts`:
  - POST handler
  - Call `revalidatePath('/')` and `revalidatePath('/casting')`
  - Return `{ revalidated: true }`

**Acceptance criteria:** GET `/api/keepalive` with correct header returns 200. POST `/api/revalidate` returns 200. GET `/api/keepalive` without header returns 401.

---

## BLOCK 2 — Libs & Helpers

---

### ISSUE-007: Create settings lib

**Context:** Key/value pattern for site configuration. Reference: SPEC.md `lib/settings.ts`.

**Tasks:**
- Create `lib/settings.ts` with:
  - `getSettings(keys: string[]): Promise<Record<string, string>>` — fetches multiple keys in one query, returns empty string for missing keys (no throw)
  - `setSetting(key: string, value: string): Promise<void>` — upsert + POST to `/api/revalidate`
  - `setSettings(settings: Record<string, string>): Promise<void>` — batch upsert + POST to `/api/revalidate` once
- Read with `supabase/server`, write with `supabase/admin`

**Acceptance criteria:** All functions fully typed. `getSettings` never throws for missing keys.

---

### ISSUE-008: Create talents, partners and image-slots libs

**Context:** Reusable database query functions. Reference: SPEC.md `lib/` section.

**Tasks:**
- Create `lib/talents.ts` with:
  - `getTalentsForMarquee(count: number)`: SELECT ORDER BY `featured DESC, created_at ASC` LIMIT count
  - `getTalentsPaginated(page, category?, pageSize = 20)`: SELECT with optional `categories @> ARRAY[category]::text[]` filter, returns `{ data, total, totalPages }`
  - `getCategories()`: SELECT DISTINCT unnest of `categories` array, alphabetically sorted
  - `createTalent`, `updateTalent`, `deleteTalent`: standard CRUD with admin client
- Create `lib/partners.ts` with:
  - `getPartners()`: SELECT ORDER BY `sort_order ASC`
  - `createPartner(logoUrl: string)`, `deletePartner(id: string)`
- Create `lib/image-slots.ts` with:
  - `getImageSlots()`: SELECT all
  - `updateSlot(id: string, data: Partial<ImageSlot>)`: used for image URL and enabled toggle

**Acceptance criteria:** All functions typed. `getTalentsPaginated` returns correct `total` for pagination math.

---

## BLOCK 3 — Admin: Auth & Shell

---

### ISSUE-009: Create admin login page

**Context:** Email + password login form using Supabase Auth. Reference: SPEC.md admin section.

**Tasks:**
- Create `app/admin/login/page.tsx` (client component)
- Form fields: email, password
- Submit: `supabase.auth.signInWithPassword({ email, password })`
- On success: redirect to `/admin`
- On error: display message using shadcn `Alert`
- Styling: centered, clean layout using shadcn `Card`

**Acceptance criteria:** Valid credentials redirect to `/admin`. Invalid credentials show a readable error message.

---

### ISSUE-010: Create admin layout and navigation

**Context:** Admin shell with nav linking all tabs. Reference: SPEC.md `app/admin/layout.tsx`.

**Tasks:**
- Create `app/admin/layout.tsx` (client component)
- Create `components/admin/AdminNav.tsx` with links to all tabs:
  - Hero, Talents, Partners, Images, CTA, SEO, Scripts, Users
- Show current user email
- Logout button: `supabase.auth.signOut()` + redirect to `/admin/login`
- Responsive: fixed sidebar on desktop, top nav on mobile (use shadcn `Sheet` for mobile drawer)

**Acceptance criteria:** All tabs navigable. Logout works and redirects correctly.

---

## BLOCK 4 — Admin: Content Tabs

---

### ISSUE-011: Hero tab

**Context:** 3 editable fields. Reference: PRD.md section 5.2, SPEC.md `site_settings` keys.

**Tasks:**
- Create `app/admin/hero/page.tsx` (client component)
- On mount: fetch `hero_button_enabled`, `hero_button_label`, `hero_button_url` via `getSettings`
- Form:
  - shadcn `Switch` for button toggle
  - shadcn `Input` for label
  - shadcn `Input` for URL
- Submit: `setSettings({ hero_button_enabled, hero_button_label, hero_button_url })`
- Feedback: shadcn `Toast` on success/error

**Acceptance criteria:** Saving updates `site_settings`. Toast confirms the operation.

---

### ISSUE-012: CTA tab

**Context:** Contact button and talents button toggle. Reference: PRD.md section 5.2.

**Tasks:**
- Create `app/admin/cta/page.tsx`
- Fields: `contact_button_label`, `contact_button_url`, `talents_button_enabled`
- Same form pattern as ISSUE-011

**Acceptance criteria:** Saving updates all 3 keys in `site_settings`.

---

### ISSUE-013: SEO tab

**Context:** Metatags and Open Graph. Reference: PRD.md section 5.2.

**Tasks:**
- Create `app/admin/seo/page.tsx`
- Text fields: `seo_title`, `seo_description`, `og_title`, `og_description`
- Create `components/admin/ImageUpload.tsx` (reusable):
  - Props: `bucket: string`, `currentUrl?: string`, `onUpload: (url: string) => void`
  - Shows current image or placeholder
  - Handles file select → Supabase Storage upload → returns public URL
- Use `ImageUpload` for `og_image_url` → bucket `og-images`
- Simple sharing card preview using the filled fields

**Acceptance criteria:** All fields save to `site_settings`. Image upload persists public URL.

---

### ISSUE-014: Scripts tab

**Context:** Code injection for a non-technical marketing operator. Reference: SPEC.md `ScriptsWarning` component.

**Tasks:**
- Create `app/admin/scripts/page.tsx`
- Create `components/admin/ScriptsWarning.tsx`: shadcn `Alert` with `destructive` variant and warning text
- 3 separate `Textarea` fields with labels: "Code in `<head>`", "Code in `<body>`", "Footer ad code"
- Each field has its own save button (prevents accidental overwrite of other fields)
- Keys: `script_head`, `script_body`, `script_footer`
- No sanitization of content

**Acceptance criteria:** Warning visible at top. Each field saves independently. Content stored as-is.

---

### ISSUE-015: Partners tab

**Context:** Logo upload and removal. Reference: PRD.md section 5.2.

**Tasks:**
- Create `app/admin/partners/page.tsx`
- Display current logos in a grid with remove button on each
- Upload new logo: `ImageUpload` component → bucket `partner-logos` → insert to `partners` table
- Remove: delete from Storage + delete row from `partners` table
- Sort order: simple numeric `sort_order` field editable inline

**Acceptance criteria:** Upload adds to grid. Remove deletes from both Storage and database.

---

### ISSUE-016: Images (Slots) tab

**Context:** Figma-mapped image slots with enable/disable toggle. Reference: PRD.md section 5.2, SPEC.md `image_slots` table.

**Tasks:**
- Create `app/admin/images/page.tsx`
- List all slots from `image_slots` table showing `label` as human-readable name
- For each slot:
  - Current image preview (or placeholder if empty)
  - `ImageUpload` for replacing image → bucket `image-slots`
  - shadcn `Switch` for `enabled` toggle — saves immediately on change (no submit button)

**Acceptance criteria:** Toggle updates `enabled` in real time. Image upload replaces the slot's image.

---

### ISSUE-017: Users tab

**Context:** Invite and remove admin users. Reference: PRD.md section 5.1, SPEC.md User Invite Flow.

**Tasks:**
- Create `app/admin/users/page.tsx`
- List existing users via server action calling `supabase.auth.admin.listUsers()`
- Invite form:
  - Email input
  - Client-side domain validation against `ALLOWED_DOMAINS` env var
  - If invalid domain: show error immediately, do not call server
  - If valid: server action calls `supabase.auth.admin.inviteUserByEmail(email)` with service role client
- Remove button: server action calls `supabase.auth.admin.deleteUser(userId)`

**Acceptance criteria:** Invite email is delivered. Invalid domain is blocked with a clear message. User removal works.

---

### ISSUE-018: Talents tab — Individual CRUD

**Context:** Create, edit and delete talents one by one. Reference: SPEC.md `TalentForm` component.

**Tasks:**
- Create `app/admin/talents/page.tsx`: talent list with name search + "New Talent" button + "Import" button
- Create `app/admin/talents/[id]/page.tsx`: edit form (also used for new talent with id = 'new')
- Create `components/admin/TalentForm.tsx` with fields:
  - `name` (Input)
  - `categories` (comma-separated input or chip-style input)
  - `featured` (Switch)
  - `photo_url` (ImageUpload → bucket `talent-photos`)
  - `description` (RichTextEditor / Tiptap)
  - Additional fields in a collapsible section: `instagram_url`, `tiktok_url`, `followers_range`, `location`, `gender`, `lgbtqia`, `of_age`, `has_children`, `dietary_restriction`, `has_pet`, `birth_date`, `civil_status`
- Delete with confirmation using shadcn `AlertDialog`

**Acceptance criteria:** Full CRUD works. Photo upload persists URL. Extra fields save to database.

---

### ISSUE-019: Talents tab — Spreadsheet Import

**Context:** Bulk import from `.xlsx` file with Google Drive photo download. Reference: SPEC.md `ImportSpreadsheet` component.

**Tasks:**
- Create `components/admin/ImportSpreadsheet.tsx`
- Install SheetJS: `npm install xlsx`
- Client-side file parse
- Validate required columns: `name`, `photo_url`, `categories`
- Create server action `importTalentPhoto(photoUrl: string, talentName: string)`:
  - Fetch image from URL
  - On success: upload to `talent-photos` Storage bucket, return public URL
  - On failure: return `null`
- For each spreadsheet row: call server action for photo, insert talent to DB (with `photo_pending = true` if photo failed)
- UI: progress indicator + per-item status log
- Final summary: "X talents imported successfully, Y with pending photo"
- For each pending photo, show: name + message: "The image for [name] could not be downloaded. To fix: open the Google Drive link → Share → 'Anyone with the link'."

**Acceptance criteria:** Import of 10+ rows completes without timeout. Photo failures do not block other imports. Final summary is accurate.

---

### ISSUE-020: Marquee configuration

**Context:** Operator sets how many talents appear in the home marquee. Reference: PRD.md section 5.2.

**Tasks:**
- Add a "Marquee Settings" section inside the Talents tab (or as a separate card above the talent list)
- shadcn `Input` type number, label: "Number of talents in the marquee"
- Min: 1, no defined max
- On save: `setSetting('marquee_count', value)` → triggers revalidation
- Helper text: "Featured talents are shown first. Remaining slots are filled by most recently added."

**Acceptance criteria:** Saving updates `marquee_count` in `site_settings` and triggers ISR revalidation.

---

## BLOCK 5 — Public Frontend

> ### Non-negotiable rules for every issue in this block
>
> **Figma fidelity is the primary constraint.** The designer's work must be respected with precision. Any deviation from the Figma is a bug, not a design decision.
>
> **Before writing a single line of code for each issue:**
> 1. Use the Figma MCP to read all relevant frames (Desktop, Tablet, Mobile)
> 2. Extract and document: exact colors (hex), font families, font sizes (px), font weights, line heights, letter spacing, spacing values (padding, margin, gap), border radius, opacity, and shadow values
> 3. Summarize in plain language what you understood about the layout, hierarchy, and behavior of the component
> 4. Present this summary to me and **wait for my explicit confirmation before writing any code**
> 5. Only after confirmation: implement the component
>
> **Responsive implementation rules** (Figma shows px, but code must be responsive):
> - Font sizes: convert px to `clamp()` or `rem`. Use `clamp(minRem, preferredVw, maxRem)` for display/heading sizes that must scale fluidly between breakpoints. Body text uses `rem` with a sensible base.
> - Spacing (padding, margin, gap): use Tailwind responsive prefixes (`md:`, `lg:`) mapped to the 3 Figma breakpoints. Do not use fixed `px` values for layout spacing.
> - Widths and heights: prefer `%`, `vw`, `max-w-*`, or `w-full` over fixed `px` widths. Use fixed `px` only for elements that must never change size (icons, logos, borders).
> - Images: always use `next/image` with `fill` or responsive `width`/`height` + `sizes` prop. Never hard-code image dimensions in px without a responsive strategy.
> - Layout must never overflow horizontally. After implementation, verify at 375px, 768px, 1280px, 1440px, and 1920px.
> - Use the globally installed frontend skill before writing component code.

---

### ISSUE-021: Public layout with script injection

**Context:** Dynamic scripts from admin injected into public pages. Reference: SPEC.md `app/(public)/layout.tsx`.

**Tasks:**
- Create `app/(public)/layout.tsx` (server component)
- Fetch `script_head`, `script_body`, `script_footer` via `getSettings`
- Inject `script_head` in `<head>` via `dangerouslySetInnerHTML`
- Inject `script_body` immediately after `<body>` opening
- Pass `script_footer` as prop to `Footer`
- `export const revalidate = 60`

**Acceptance criteria:** Script saved in admin appears rendered in the public page HTML source.

---

### ISSUE-022: Dynamic metatags and sitemap

**Context:** SEO configurable from admin. Reference: PRD.md section 5.2.

**Tasks:**
- In `app/(public)/page.tsx`: export `generateMetadata()` function
- Fetch SEO keys from `site_settings`
- Return Next.js `Metadata` object with: `title`, `description`, `openGraph.title`, `openGraph.description`, `openGraph.images`
- Create `public/robots.txt`: allow `/` and `/casting`, disallow `/admin`
- Create `app/sitemap.ts`: return entries for `/` and `/casting`

**Acceptance criteria:** Tags appear correctly in `<head>`. Open Graph works when tested with Facebook Sharing Debugger.

---

### ISSUE-023: Header and Footer components

**Context:** Pixel-perfect build from Figma. Figma MCP required.

**Pre-implementation protocol (mandatory):**
- Read Desktop, Tablet, and Mobile frames for Header and Footer via Figma MCP
- Extract: background color, nav link font (family, size, weight, color, hover state), logo dimensions, hamburger icon, footer background, footer text styles, column layout, spacing between elements, ads slot dimensions and position
- Summarize what you understood and wait for my confirmation before coding

**Tasks (after confirmation only):**
- Create `components/public/Header.tsx`:
  - Desktop: navigation links only (no logo) — exact font and spacing per Figma
  - Tablet/Mobile: logo + hamburger menu using shadcn `Sheet` — exact logo size and hit area per Figma
  - Smooth transition between breakpoints, no layout jump
- Create `components/public/Footer.tsx`:
  - Full structure per Figma — all columns, links, text styles
  - Pre-defined ads slot: renders `script_footer` via `dangerouslySetInnerHTML`

**Acceptance criteria:** Side-by-side comparison with Figma frames shows no visible difference in layout, typography, or spacing. Correct behavior at 375px, 768px, and 1280px+.

---

### ISSUE-024: Hero section

**Context:** Most complex component — lighthouse SVG, light beam, sparkle. Figma MCP required.

**Pre-implementation protocol (mandatory):**
- Read Desktop, Tablet, and Mobile Hero frames via Figma MCP
- Extract: section background, exact text content and styles (headline font, size, weight, color, line height), button styles (background, border, text, radius, padding), lighthouse SVG position and dimensions relative to the section, light beam origin point and angle, sparkle position relative to lighthouse window, any overlapping layers or z-index behavior
- Explain the strategy you plan to use for the light beam (always touching right viewport edge) and the sparkle (always exiting the lighthouse window) — including which CSS/SVG technique and why
- Wait for my confirmation before coding

**Tasks (after confirmation only):**
- Create `components/public/Hero.tsx`
- Light beam strategy: use `position: absolute; right: 0` with width calculated to always reach the right edge regardless of viewport width. Test at 1280px, 1440px, 1920px, and 2560px.
- Sparkle: positioned relative to the lighthouse SVG container, not the viewport. Must stay anchored to the lighthouse window at all breakpoints.
- Props: `buttonEnabled: boolean`, `buttonLabel: string`, `buttonUrl: string`
- Button renders conditionally based on `buttonEnabled`

**Acceptance criteria:** At 1280px, 1440px, 1920px, and 2560px: beam touches the right edge, sparkle exits the lighthouse window, no text overflow, no horizontal scroll.

---

### ISSUE-025: About, Creators, and HowWeWork sections

**Context:** Static sections. Figma MCP required.

**Pre-implementation protocol (mandatory):**
- Read Desktop, Tablet, and Mobile frames for About, Creators, and HowWeWork via Figma MCP
- For each section, extract: background color, all text content and styles, number formatting (About stats), tag styles (Creators), card layout and content (HowWeWork), spacing between elements, any icons or decorative elements
- Summarize layout and hierarchy for all three sections and wait for my confirmation before coding

**Tasks (after confirmation only):**
- Create `components/public/About.tsx`: stat numbers with fluid sizing via `clamp()`, supporting text, exact layout per Figma
- Create `components/public/Creators.tsx`: category tags with exact padding, border, font, and color per Figma
- Create `components/public/HowWeWork.tsx`: 4 cards with exact spacing, icon placement, text styles, and grid/stack behavior per breakpoint

**Acceptance criteria:** Side-by-side comparison with Figma shows no visible difference. Responsive at 375px, 768px, and 1280px+. No horizontal overflow at any breakpoint.

---

### ISSUE-026: TalentsMarquee component

**Context:** Auto-looping marquee. Figma MCP required.

**Pre-implementation protocol (mandatory):**
- Read the Talents/Marquee section frames via Figma MCP
- Extract: section background, card dimensions (width, height), card content (photo aspect ratio, name font, category font, card border/radius/shadow), gap between cards, marquee direction, any section heading above the marquee
- Summarize and wait for my confirmation before coding

**Tasks (after confirmation only):**
- Create `components/public/TalentsMarquee.tsx`
- Receives `talents: Talent[]` as prop
- Duplicate array for seamless infinite loop — no visible gap or jump between repetitions
- Pure CSS animation: `@keyframes marquee` + `animation: marquee Xs linear infinite`. No JavaScript-based animation, no external slider library.
- Card dimensions and styles exactly per Figma
- Photos: `next/image` with correct aspect ratio

**Acceptance criteria:** Seamless loop at all viewport widths. Card dimensions match Figma. Works correctly with both 5 and 20 talents.

---

### ISSUE-027: Partners and CTA sections

**Context:** Logo grid and CTA. Figma MCP required.

**Pre-implementation protocol (mandatory):**
- Read Desktop, Tablet, and Mobile frames for Partners and CTA sections via Figma MCP
- Extract: Partners — section background, grid columns per breakpoint, logo container dimensions, logo sizing behavior (contain? fixed height?); CTA — background, headline styles, button styles (both buttons if two exist), spacing
- Summarize and wait for my confirmation before coding

**Tasks (after confirmation only):**
- Create `components/public/Partners.tsx`:
  - Logo grid with responsive columns per Figma breakpoints
  - Logos rendered via `next/image` with `object-contain`
  - Receives `partners: Partner[]` as prop
- Create `components/public/CTA.tsx`:
  - Full layout per Figma
  - Receives `contactButtonLabel`, `contactButtonUrl`, `showTalentsButton` as props
  - Buttons render conditionally

**Acceptance criteria:** Logo grid matches Figma at all breakpoints. Conditional buttons work. No layout shift when a button is hidden.

---

### ISSUE-028: Home page — final composition

**Context:** Assemble all sections with real Supabase data. Reference: SPEC.md `app/(public)/page.tsx`.

**Tasks:**
- Create `app/(public)/page.tsx` (server component)
- Fetch in parallel via `Promise.all`:
  - Hero settings (`hero_button_enabled`, `hero_button_label`, `hero_button_url`)
  - Marquee talents (N = `marquee_count` from settings)
  - Partners
  - Image slots
  - CTA settings
- Pass data as props to each section component
- Verify the full page at 375px, 768px, 1280px, 1440px, and 1920px before marking as done
- `export const revalidate = 60`

**Acceptance criteria:** Home renders with real data. No broken layout at any tested viewport width. ISR configured.

---

### ISSUE-029: Casting page

**Context:** Paginated talent grid with category filter. Figma MCP required.

**Pre-implementation protocol (mandatory):**
- Read Desktop, Tablet, and Mobile Casting page frames via Figma MCP
- Extract: page background, heading styles, filter chip styles (default and active states), talent card dimensions and content layout, grid columns per breakpoint, pagination component style
- Summarize and wait for my confirmation before coding

**Tasks (after confirmation only):**
- Create `app/(public)/casting/page.tsx` (server component)
- Read `searchParams`: `page` (default: 1) and `category` (optional)
- Fetch `getTalentsPaginated(page, category)` and `getCategories()`
- Render:
  - Category filter chips — exact active/inactive styles per Figma
  - Talent card grid — responsive columns per Figma breakpoints
  - Google-style pagination: first, previous, up to 5 visible page numbers, next, last — styled per Figma
- All navigation via URL params (not client state) — required for ISR compatibility
- `export const revalidate = 60`

**Acceptance criteria:** Category filter works. Pagination navigates correctly. URL reflects state. Layout matches Figma at 375px, 768px, and 1280px+.

---

## BLOCK 6 — Quality & Deploy

---

### ISSUE-030: TypeScript types and lint cleanup

**Tasks:**
- Create `types/index.ts` with interfaces: `Talent`, `Partner`, `ImageSlot`, `SiteSettings`
- Resolve all `npm run build` errors
- Remove all explicit `any` types from main files
- Ensure ESLint passes with Next.js recommended rules

**Acceptance criteria:** `npm run build` completes without errors or critical warnings.

---

### ISSUE-031: Environment setup and Vercel deploy

**Tasks:**
- Set all environment variables in Vercel dashboard
- Verify cron job appears in Vercel → Settings → Cron Jobs
- Test ISR: save in admin → wait 60s → confirm public site updated
- Test on-demand revalidation: save in admin → confirm POST to `/api/revalidate` → confirm immediate update
- Verify `X-Robots-Tag` header on `/admin` response
- Test Open Graph with https://developers.facebook.com/tools/debug/

**Acceptance criteria:** Stable deploy. ISR working. Admin not indexed by search engines.

---

## Recommended Execution Order

```
BLOCK 1 (001–006) → BLOCK 2 (007–008) → BLOCK 3 (009–010)
→ BLOCK 4 (011–020) → BLOCK 5 (021–029) → BLOCK 6 (030–031)
```

**Within BLOCK 5**, ISSUE-024 (Hero) is the most complex.  
Execute it with Figma MCP active and pay special attention to SVG behavior across wide viewports (1280px–2560px).
