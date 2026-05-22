# About Section Part 1 V2 Audit

Figma nodes read: desktop `2327:3083`, tablet `2327:3093`, mobile `2327:3103`.

Current V1: `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/About.tsx` renders one responsive section with static text, a current embedded video placeholder area, and three stats cards. It receives an unused `imageUrl` prop. There is no admin About page, no About settings form, and no `about_version` setting.

Figma V2 diff: background remains `#fff2e7`; content becomes a yellow rounded text panel plus a right/below media placeholder and stats group. Desktop uses a two-column row inside `7.5rem` horizontal padding and `4.5rem` vertical padding, outer content height `50rem`, column gap `6.5625rem`, text panel `#e5a545` with `4rem` padding and `2.5rem` radius, media `44.5625rem x 24rem`, and three stat cards in `#d1d362`, `#5c8dc9`, `#b1375b`. Tablet/mobile stack the yellow panel, media, and cards. Figma contains no animation or transition hints for About V2.

Schema finding: no `about_version` key exists in migrations, types, settings fetches, or code search. `site_settings` is the existing pattern for admin-controlled public settings.

## Issue 1 — Supabase About Version Setting
**Depends on:** none
**Files:** new migration file in `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/supabase/migrations/`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/types/index.ts`
**What to do:** Add an `about_version` setting through `site_settings` if it still does not exist, defaulting to `v1`. Do not create new content fields because About V2 content is static.
⚠️ **IMPORTANT:** Do NOT edit `001_initial_schema.sql`. Check how existing migrations are numbered in the `/migrations` folder and create a new migration file with the next sequential number. Only edit the initial schema if the project has no migration history and that is the established pattern — verify before touching it.
**Done when:** `about_version` is seeded or migrated with value `v1`, and `site_settings` remains the source of truth.

## Issue 2 — Admin About Version Switcher
**Depends on:** Issue 1
**Files:** to be determined by the agent
**What to do:** Add an About Section Part 1 V1/V2 selector to the admin, using the current `Card`, `Field`, `Switch`/selector, `saveSettingsAction`, and toast patterns. Add no additional About controls.
⚠️ **IMPORTANT:** Before writing any code, check whether an About admin page already exists in the project. If it does, add the switcher there. If it does not exist, check where the most appropriate place is to add it (e.g. alongside the Hero admin page or as a new `/admin/about` route) and confirm the approach before proceeding. Do not assume the correct file — verify first.
**Done when:** Admin can persist `about_version` as `v1` or `v2` without introducing a new About content manager.

## Issue 3 — Frontend About V2 Desktop
**Depends on:** Issue 1
**Files:** `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/About.tsx`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/AboutV2.tsx`
**What to do:** Build the desktop About V2 layout pixel-perfect to Figma using rem-only layout/font/spacing values: `#fff2e7` section, `7.5rem` horizontal padding, `4.5rem` vertical padding, `50rem` row height, `6.5625rem` column gap, yellow panel with `4rem` padding and `2.5rem` radius, title/text styling, right media placeholder, and stat cards.
**Done when:** Desktop About V2 matches Figma and About V1 remains unchanged.

## Issue 4 — Frontend About V2 Tablet
**Depends on:** Issue 3
**Files:** `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/AboutV2.tsx`
**What to do:** Add only tablet styles for About V2: `4rem` side padding, `4.5rem` vertical padding, `2.5rem` stack gap, yellow panel padding `4rem`, radius `2rem`, title sizes `2.5rem` and `11.25rem`, media height `24rem`, and three horizontal stat cards sized from Figma.
**Done when:** Tablet matches Figma and desktop output is unchanged.

## Issue 5 — Frontend About V2 Mobile
**Depends on:** Issue 4
**Files:** `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/AboutV2.tsx`
**What to do:** Add only mobile styles for About V2: `2rem` side padding, `4.5rem` vertical padding, `2.5rem` stack gap, yellow panel padding `3rem`, radius `2rem`, title sizes `1.5rem` and `6.75rem`, media height `24rem`, and vertical full-width stat cards.
**Done when:** Mobile matches Figma and desktop/tablet output is unchanged.

## Issue 6 — Frontend About Version Switcher
**Depends on:** Issue 5
**Files:** `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/app/(public)/page.tsx`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/About.tsx`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/AboutV2.tsx`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/lib/settings.ts`
**What to do:** Fetch `about_version` on the server and conditionally render About V1 or V2 before paint. Avoid client-only switching.
**Done when:** The home page renders the selected About version with no flash of the wrong layout.
