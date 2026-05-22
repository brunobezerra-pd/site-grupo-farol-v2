# Hero V2 Audit

Figma nodes read: desktop `2327:3082`, tablet `2327:3092`, mobile `2327:3102`.

Current V1: `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/Hero.tsx` renders a lighthouse-based yellow hero with fixed px Tailwind values, V1 button settings, desktop nav, tablet/mobile hamburger treatment, and no media carousel. Admin currently manages only `hero_button_enabled`, `hero_button_label`, and `hero_button_url` through `site_settings`.

Figma V2 diff: background changes to `#fff2e7`; hero becomes header + media row + editorial headline. Desktop uses six `#e0d8d1` media slots at `15.8125rem x 28.125rem`, content top padding `4.5rem`, section height `62.25rem`, side padding `7.5rem`, headline `18.5rem`, badge `#d1d362` with `6.1875rem` radius. Tablet uses three media slots, section height `50rem`, side padding `4rem`, headline `11rem`. Mobile uses one full-width horizontal media slot at `26.6667rem x 15rem`, no carousel, side padding `2rem`, headline stacked at `11rem`. Figma contains no animation hints; desktop/tablet auto-loop must reuse the casting vitrine behavior.

Existing marquee pattern to reuse: `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/TalentsMarquee.tsx` repeats items three times, measures the first and second loop with refs, starts offset at `-loopWidth`, advances via `requestAnimationFrame` at `44px/s`, normalizes offsets, pauses on hover, and uses `420ms` arrow transitions.

Schema finding: no `hero_version` key exists in migrations, types, settings fetches, or code search. `site_settings` is a generic key/value table and is the existing pattern for admin-controlled public settings.

## Issue 1 — Supabase Hero Version Setting
**Depends on:** none
**Files:** new migration file in `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/supabase/migrations/`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/types/index.ts`
**What to do:** Add a `hero_version` setting through `site_settings` if it still does not exist, defaulting to `v1`. Keep using the existing generic settings table instead of adding a dedicated column.
⚠️ **IMPORTANT:** Do NOT edit `001_initial_schema.sql`. Check how existing migrations are numbered in the `/migrations` folder and create a new migration file with the next sequential number (e.g. `002_hero_version.sql`). Only edit the initial schema if the project has no migration history and that is the established pattern — verify before touching it.
**Done when:** `hero_version` is seeded or migrated with value `v1`, no duplicate key is created, and generated/local types still represent `site_settings` as the source of truth.

## Issue 2 — Admin Hero Version Switcher
**Depends on:** Issue 1
**Files:** `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/app/admin/hero/page.tsx`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/admin/HeroSettingsForm.tsx`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/app/admin/actions.ts`
**What to do:** Add a V1/V2 selector to the existing Hero admin card and save it with `saveSettingsAction`, following the current `Switch`, `Field`, `Card`, `Input`, and toast patterns.
**Done when:** Admin can persist `hero_version` as `v1` or `v2` without changing the existing button controls.

## Issue 3 — Admin Hero V2 Media Manager
**Depends on:** Issue 1
**Files:** `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/app/admin/hero/page.tsx`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/admin/HeroSettingsForm.tsx`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/admin/ImageUpload.tsx`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/app/admin/actions.ts`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/lib/hero-media.ts`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/types/index.ts`, new migration file in `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/supabase/migrations/`
**What to do:** Create a Hero V2 media model and manager for unlimited ordered desktop/tablet carousel items plus one mobile video. Support PNG/JPG/WEBP uploads, video file uploads, video URL, and embed code. Reuse `ImageUpload` upload behavior where practical, but do not force video/embed handling through `next/image`.
⚠️ **IMPORTANT:** Any new table or column needed must go in a new migration file with the next sequential number in `/migrations`. Do NOT edit `001_initial_schema.sql`.
**Done when:** Admin can create, edit, delete, reorder, and save Hero V2 desktop/tablet media items and exactly one mobile video source.

## Issue 4 — Frontend Hero V2 Desktop
**Depends on:** Issue 3
**Files:** `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/Hero.tsx`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/HeroV2.tsx`
**What to do:** Build the desktop Hero V2 layout pixel-perfect to Figma using rem-only layout/font/spacing values: `#fff2e7` shell, `5.625rem` header, `7.5rem` side padding, six `15.8125rem x 28.125rem` media slots, `5.5rem` media-to-title gap, badge, star, decoration, and `18.5rem` headline.
**Done when:** Desktop V2 visually matches Figma and V1 remains unchanged.

## Issue 5 — Frontend Hero V2 Media Carousel Desktop
**Depends on:** Issue 4
**Files:** `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/TalentsMarquee.tsx`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/HeroV2MediaCarousel.tsx`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/HeroV2.tsx`
**What to do:** Implement the desktop Hero V2 media carousel with the same auto-loop behavior as `TalentsMarquee`: tripled items, measured loop width, `requestAnimationFrame`, `44px/s`, offset normalization, hover pause, and seamless looping.
**Done when:** Desktop media auto-loops seamlessly and behavior matches the casting vitrine.

## Issue 6 — Frontend Hero V2 Tablet
**Depends on:** Issue 5
**Files:** `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/HeroV2.tsx`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/HeroV2MediaCarousel.tsx`
**What to do:** Add only tablet styles for Hero V2: `4rem` side padding, `50rem` section height, `5.625rem` header, three visible media slots, `4.5rem` spacing, `11rem` headline, tablet badge/star/decoration positions.
⚠️ **IMPORTANT:** Before applying any media slot dimensions for tablet, re-read the Figma tablet frame (node `2327:3092`) and confirm the exact values. The value `10.7525rem` extracted during research looks like a suspicious px→rem conversion artifact — do not apply it blindly. Use whatever the Figma specifies after verification.
**Done when:** Tablet matches Figma and desktop output is unchanged.

## Issue 7 — Frontend Hero V2 Mobile
**Depends on:** Issue 6
**Files:** `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/HeroV2.tsx`
**What to do:** Add only mobile styles for Hero V2: `2rem` side padding, `4.375rem` header, one full-width horizontal video at `26.6667rem x 15rem`, no carousel, no marquee, no slides, stacked `11rem` headline, mobile badge/star/decoration positions.
**Done when:** Mobile uses the stakeholder-uploaded single video and has no carousel behavior.

## Issue 8 — Frontend Hero Version Switcher
**Depends on:** Issue 7
**Files:** `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/app/(public)/page.tsx`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/Hero.tsx`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/components/public/HeroV2.tsx`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/lib/settings.ts`, `/Users/brunobezerra/Desktop/ai-projects/site-grupo-farol-v2/lib/hero-media.ts`
**What to do:** Fetch `hero_version` and Hero V2 media on the server and conditionally render V1 or V2 before paint. Avoid client-only switching.
**Done when:** The home page renders the selected version with no flash of the wrong hero and V1 button behavior remains intact.
