# SPEC.md — Grupo Farol Website v2

> Technical implementation specification. Derived from PRD.md.  
> Defines files to create/modify and what to do in each one.  
> Reference for ISSUES.md generation.

---

## Folder Structure

```
/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  # Home (ISR revalidate: 60)
│   │   ├── casting/
│   │   │   └── page.tsx              # Casting page (ISR revalidate: 60)
│   │   └── layout.tsx                # Public layout (injects head/body scripts)
│   ├── admin/
│   │   ├── layout.tsx                # Admin layout (auth guard + nav)
│   │   ├── page.tsx                  # Redirect to /admin/hero
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── hero/page.tsx
│   │   ├── talents/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── partners/page.tsx
│   │   ├── images/page.tsx
│   │   ├── cta/page.tsx
│   │   ├── seo/page.tsx
│   │   ├── scripts/page.tsx
│   │   └── users/page.tsx
│   ├── api/
│   │   ├── keepalive/route.ts
│   │   └── revalidate/route.ts
│   ├── sitemap.ts
│   └── layout.tsx                    # Root layout
├── components/
│   ├── public/
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Creators.tsx
│   │   ├── TalentsMarquee.tsx
│   │   ├── HowWeWork.tsx
│   │   ├── Partners.tsx
│   │   ├── CTA.tsx
│   │   └── Footer.tsx
│   └── admin/
│       ├── AdminNav.tsx
│       ├── ImageUpload.tsx
│       ├── RichTextEditor.tsx        # Tiptap wrapper
│       ├── TalentForm.tsx
│       ├── ImportSpreadsheet.tsx
│       └── ScriptsWarning.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # createBrowserClient
│   │   ├── server.ts                 # createServerClient
│   │   └── admin.ts                  # createServiceRoleClient
│   ├── settings.ts
│   ├── talents.ts
│   ├── partners.ts
│   └── image-slots.ts
├── types/
│   └── index.ts                      # Talent, Partner, ImageSlot, SiteSettings
├── public/
│   └── fonts/
│       ├── Agharti.woff2
│       ├── CasualHuman-Regular.woff2
│       ├── CasualHuman-Bold.woff2
│       └── Foun.woff2
├── styles/
│   └── globals.css
├── middleware.ts
├── next.config.ts
└── vercel.json
```

---

## File-by-File Specification

---

### `vercel.json`
```json
{
  "crons": [{ "path": "/api/keepalive", "schedule": "0 9 * * *" }],
  "headers": [
    {
      "source": "/admin/(.*)",
      "headers": [{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }]
    }
  ]
}
```

---

### `middleware.ts`
- Intercept all `/admin/*` routes
- Verify Supabase Auth session via `createServerClient` from `@supabase/ssr`
- If not authenticated: redirect to `/admin/login`
- If authenticated: refresh session cookies and proceed
- Matcher: `/admin/:path*`

---

### `app/layout.tsx` (Root)
- Register Google fonts via `next/font/google`: Poppins, PT Serif
- Apply font CSS variables to `<html>` element
- No external scripts here (dynamic scripts live in public layout)

---

### `app/(public)/layout.tsx`
- Server component
- Fetch `script_head`, `script_body`, `script_footer` from `site_settings`
- Inject `script_head` inside `<head>` via `dangerouslySetInnerHTML`
- Inject `script_body` immediately after `<body>` opening tag
- Pass `script_footer` as prop to `Footer` component
- `export const revalidate = 60`

---

### `app/(public)/page.tsx` (Home)
- Server component
- Fetch in parallel via `Promise.all`:
  - Hero settings (`hero_button_enabled`, `hero_button_label`, `hero_button_url`)
  - Marquee talents (N = `marquee_count`, featured first)
  - Partners
  - Image slots
  - CTA settings
- Pass data as props to each section component
- `export const revalidate = 60`

---

### `app/(public)/casting/page.tsx`
- Server component
- Read `searchParams`: `page` (default: 1) and `category` (optional)
- Fetch `getTalentsPaginated(page, category)` and `getCategories()`
- Render: category filter chips + talent grid + Google-style pagination
- Pagination navigates via URL params (not state) — compatible with ISR
- `export const revalidate = 60`

---

### `app/admin/layout.tsx`
- Client component
- Render `AdminNav` with links to all tabs
- Show current user email + logout button
- Logout: `supabase.auth.signOut()` → redirect to `/admin/login`
- Layout: fixed sidebar on desktop, top nav on mobile

---

### `app/api/keepalive/route.ts`
- GET handler
- Validate `Authorization: Bearer ${CRON_SECRET}` header
- Run simple Supabase query: `SELECT 1`
- Return `{ ok: true, timestamp: new Date().toISOString() }`
- Return 401 if secret is missing or invalid

---

### `app/api/revalidate/route.ts`
- POST handler
- Call `revalidatePath('/')` and `revalidatePath('/casting')`
- Return `{ revalidated: true }`
- Called internally by server actions after admin saves — no public auth needed

---

### `app/sitemap.ts`
- Return static entries for `/` and `/casting`
- `changeFrequency: 'weekly'`, `priority: 1.0`

---

### `middleware.ts`
- Intercept `/admin/:path*`
- Use `createServerClient` with request/response cookies
- Redirect unauthenticated requests to `/admin/login`
- Refresh session on every request

---

### `components/public/TalentsMarquee.tsx`
- Receives `talents: Talent[]` as prop
- Duplicate array to create seamless infinite loop
- Pure CSS animation: `@keyframes marquee` + `animation: marquee Xs linear infinite`
- No slider library dependency
- Card: photo, name, category — styled per Figma

---

### `components/admin/ImportSpreadsheet.tsx`
- File input accepting `.xlsx` and `.csv`
- Client-side parse using `SheetJS` (xlsx library)
- Validate required columns: `name`, `photo_url`, `categories`
- For each valid row:
  - Call server action `importTalentPhoto(photoUrl, talentName)`
  - Server action: fetch image → upload to `talent-photos` bucket → return Storage URL
  - On fetch error: return `null`, set `photo_pending = true`
  - Insert talent to DB regardless of photo result
- Show progress bar + per-item log during import
- Final summary: "X talents imported, Y with pending photo"
- For each pending photo: show name + instruction:
  > "The image for [name] could not be downloaded. To fix: open the Google Drive link → click Share → select 'Anyone with the link'."

---

### `components/admin/RichTextEditor.tsx`
- Tiptap wrapper with extensions: Bold, Italic, Link, BulletList, OrderedList
- Toolbar using shadcn `Button` + `Toggle` components
- Output format: HTML string
- Props: `value: string`, `onChange: (html: string) => void`

---

### `components/admin/ScriptsWarning.tsx`
- shadcn `Alert` with `destructive` variant
- Text: "Warning: the fields below insert code directly into the site's pages. Errors here can break the site entirely. If in doubt, consult the technical team before saving."
- Rendered at the top of the Scripts tab

---

### `components/admin/ImageUpload.tsx`
- Reusable upload component used across multiple admin tabs
- Props: `bucket: string`, `currentUrl?: string`, `onUpload: (url: string) => void`
- Shows current image preview (or placeholder)
- Handles file selection → upload to Supabase Storage → returns public URL
- Shows upload progress state

---

### `lib/supabase/client.ts`
- `createBrowserClient` from `@supabase/ssr`
- Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### `lib/supabase/server.ts`
- `createServerClient` from `@supabase/ssr` with `next/headers` cookies
- Used in server components and server actions

### `lib/supabase/admin.ts`
- `createClient` with `SUPABASE_SERVICE_ROLE_KEY`
- **Warning comment:** "Only use in server actions and API routes. Never import on the client."

---

### `lib/settings.ts`
```typescript
getSettings(keys: string[]): Promise<Record<string, string>>
// Fetches multiple keys in a single query. Returns empty string for missing keys.

setSetting(key: string, value: string): Promise<void>
// Upsert single key. Calls /api/revalidate after write.

setSettings(settings: Record<string, string>): Promise<void>
// Batch upsert. Calls /api/revalidate once after all writes.
```
- Read: `supabase/server`
- Write: `supabase/admin`

---

### `lib/talents.ts`
```typescript
getTalentsForMarquee(count: number): Promise<Talent[]>
// ORDER BY featured DESC, created_at ASC LIMIT count

getTalentsPaginated(page: number, category?: string, pageSize = 20):
  Promise<{ data: Talent[], total: number, totalPages: number }>
// Filter: categories @> ARRAY[category] when provided

getCategories(): Promise<string[]>
// SELECT DISTINCT unnest(categories) ORDER BY 1

createTalent(data: TalentInsert): Promise<Talent>
updateTalent(id: string, data: Partial<Talent>): Promise<Talent>
deleteTalent(id: string): Promise<void>
```

### `lib/partners.ts`
```typescript
getPartners(): Promise<Partner[]>
// ORDER BY sort_order ASC

createPartner(logoUrl: string): Promise<Partner>
deletePartner(id: string): Promise<void>
// Also deletes image from Storage
```

### `lib/image-slots.ts`
```typescript
getImageSlots(): Promise<ImageSlot[]>
updateSlot(id: string, data: Partial<ImageSlot>): Promise<void>
// Used for both image URL update and enabled toggle
```

---

### `styles/globals.css`
```css
@font-face {
  font-family: 'Agharti';
  src: url('/fonts/Agharti.woff2') format('woff2');
  font-display: swap;
}
/* repeat for CasualHuman-Regular, CasualHuman-Bold, Foun */

:root {
  --font-agharti: 'Agharti', sans-serif;
  --font-casual-human: 'Casual Human', sans-serif;
  --font-foun: 'Foun', sans-serif;
  /* Color tokens to be extracted from Figma */
}
```

---

### `next.config.ts`
```typescript
images: {
  remotePatterns: [
    { hostname: '*.supabase.co' },      // Supabase Storage
    { hostname: 'drive.google.com' },   // Google Drive thumbnails during import
  ]
}
```

---

## Supabase Setup

### RLS Policies (apply to all 4 tables)
```sql
-- Public read
CREATE POLICY "public read"
ON [table] FOR SELECT USING (true);

-- Authenticated write
CREATE POLICY "authenticated write"
ON [table] FOR ALL USING (auth.role() = 'authenticated');
```

### Storage Buckets (create manually in Supabase dashboard)
| Bucket | Access |
|---|---|
| `talent-photos` | Public |
| `partner-logos` | Public |
| `image-slots` | Public |
| `og-images` | Public |

---

## User Invite Flow

1. Operator enters email in Users tab
2. Client validates domain against `ALLOWED_DOMAINS` env var — shows error immediately if invalid
3. If valid: server action calls `supabase.auth.admin.inviteUserByEmail(email)` using service role client
4. User receives email with password setup link
5. After setting password: access to `/admin` is granted

---

## NPM Dependencies

```json
{
  "next": "16.2.x",
  "react": "18.x",
  "typescript": "5.x",
  "tailwindcss": "3.x",
  "@supabase/ssr": "latest",
  "@supabase/supabase-js": "latest",
  "@tiptap/react": "latest",
  "@tiptap/starter-kit": "latest",
  "@tiptap/extension-link": "latest",
  "xlsx": "latest",
  "lucide-react": "latest"
}
```
`shadcn/ui` installed via CLI: `npx shadcn@latest init`
