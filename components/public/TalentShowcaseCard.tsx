"use client";

import { forwardRef } from "react";

import type { Talent } from "@/types";

const STAMP_COLORS = ["#d1d362", "#d96837", "#5c8dc9"];

export const TALENT_SHOWCASE_MOBILE_CARD_CLASS =
  "max-md:[--talent-card-content-pb:1.078rem] max-md:[--talent-card-gap:1.033rem] max-md:[--talent-card-image-pad:1.078rem] max-md:[--talent-card-pad:0.539rem] max-md:[--talent-handle-size:0.836rem] max-md:[--talent-mobile-badge-font-size:1.548rem] max-md:[--talent-mobile-badge-pb:0.516rem] max-md:[--talent-mobile-badge-pt:0.129rem] max-md:[--talent-mobile-badge-px:1.032rem] max-md:[--talent-mobile-badge-right:-0.719rem] max-md:[--talent-mobile-badge-top:-0.719rem] max-md:[--talent-name-size:2.876rem] max-md:[--talent-social-icon-size:1.078rem] max-md:[--talent-stamp-font-size:2.157rem] max-md:[--talent-stamp-left:84.96%] max-md:[--talent-stamp-pad:0.449rem] max-md:[--talent-stamp-size:30.126%] max-md:[--talent-stamp-top:-9.41%]";

export function getTalentHandle(url: string | null) {
  if (!url) return null;

  return url
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, "@")
    .replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/, "@")
    .replace(/^(www\.)?instagram\.com\//, "@")
    .replace(/^(www\.)?tiktok\.com\/@?/, "@")
    .replace(/^@?/, "@")
    .replace(/\/$/, "");
}

function getSocialProfileUrl(url: string | null, type: "instagram" | "tiktok") {
  if (!url) return null;

  const value = url.trim();
  if (!value) return null;

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const parsedUrl = new URL(withProtocol);
    const hostname = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();

    if (type === "instagram" && hostname === "instagram.com") {
      return parsedUrl.toString();
    }

    if (type === "tiktok" && hostname === "tiktok.com") {
      return parsedUrl.toString();
    }
  } catch {
    return null;
  }

  return null;
}

function getCategoryParts(talent: Talent) {
  return (talent.categories?.[0] || "Creator")
    .normalize("NFKC")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
}

function getDisplayName(name: string) {
  return name.normalize("NFKC");
}

type TalentShowcaseCardProps = {
  talent: Talent;
  index: number;
  className?: string;
  onHoverChange?: (isHovered: boolean) => void;
  mobileBadge?: "stamp" | "pill";
};

export const TalentShowcaseCard = forwardRef<HTMLElement, TalentShowcaseCardProps>(
  function TalentShowcaseCard({ talent, index, className = "", onHoverChange, mobileBadge }, ref) {
    const categoryParts = getCategoryParts(talent);
    const category = categoryParts.join("\n");
    const categorySize =
      categoryParts.length > 2
        ? "clamp(1.35rem, 7.35cqw, 2.28rem)"
        : categoryParts.length > 1
          ? "clamp(1.55rem, 8.65cqw, 2.7rem)"
          : "clamp(1.75rem, 9.64cqw, 3rem)";
    const name = getDisplayName(talent.name);
    const instagram = getTalentHandle(talent.instagram_url ?? null);
    const tiktok = getTalentHandle(talent.tiktok_url ?? null);
    const instagramUrl = getSocialProfileUrl(talent.instagram_url ?? null, "instagram");
    const tiktokUrl = getSocialProfileUrl(talent.tiktok_url ?? null, "tiktok");
    const fallbackHandle = `@${name.toLowerCase().replace(/\s+/g, "")}`;

    return (
      <article
        ref={ref}
        className={`relative flex shrink-0 flex-col gap-[var(--talent-card-media-gap,var(--talent-card-gap,5.29cqw))] rounded-[24px] bg-[#fff2e7] p-[var(--talent-card-pad,0.714%)] md:[--talent-card-media-gap:0] ${className}`}
        style={{ containerType: "inline-size" }}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
        onFocus={() => onHoverChange?.(true)}
        onBlur={() => onHoverChange?.(false)}
      >
        <div className="relative aspect-[473.917/390] max-md:aspect-[340.705/215.674] w-full overflow-hidden rounded-[16px] bg-white p-[var(--talent-card-image-pad,4.82%)]">
          {talent.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={talent.photo_url}
              alt={name}
              loading="lazy"
              className="absolute inset-0 h-full w-full rounded-[16px] object-cover"
            />
          ) : (
            <div className="absolute inset-0 rounded-[16px] bg-[#d9d9d9]" />
          )}
          <div
            aria-hidden="true"
            className="absolute left-[5.1%] top-[6.1%] h-[45.7%] w-[3.4%] opacity-80"
            style={{
              backgroundImage:
                "repeating-linear-gradient(125deg, transparent 0 10px, #1a1a1a 10px 12px, transparent 12px 18px)",
            }}
          />
        </div>

        <div className="flex w-full flex-col gap-[var(--talent-card-gap,5.29cqw)] px-[var(--talent-card-image-pad,4.82%)] pb-[var(--talent-card-content-pb,8.03%)]">
          <h3
            className="w-full truncate font-agharti-bsc-display uppercase leading-none text-[#1a1a1a]"
            style={{
              fontSize: "var(--talent-name-size, clamp(2.70rem, 16.01cqw, 4.99rem))",
            }}
          >
            {name}
          </h3>
          <div className="flex w-full items-center justify-between gap-4">
            <SocialHandle
              type="instagram"
              handle={instagram || fallbackHandle}
              href={instagramUrl}
            />
            <SocialHandle
              type="tiktok"
              handle={tiktok || instagram || fallbackHandle}
              href={tiktokUrl}
            />
          </div>
        </div>

        <div
          className={`absolute flex aspect-square w-[var(--talent-stamp-size,30.126%)] items-center justify-center rounded-full p-[var(--talent-stamp-pad,2.01%)]${mobileBadge === "pill" ? " max-md:hidden" : ""}`}
          style={{
            backgroundColor: STAMP_COLORS[index % STAMP_COLORS.length],
            left: "var(--talent-stamp-left, 84.96%)",
            top: "var(--talent-stamp-top, -9.41%)",
          }}
        >
          <p
            className="w-[124%] max-w-none rotate-[-20.07deg] whitespace-pre-line text-center font-agharti-duc-display leading-[0.82] text-[#1a1a1a]"
            style={{ fontSize: `var(--talent-stamp-font-size, ${categorySize})` }}
          >
            {category}
          </p>
        </div>

        {mobileBadge === "pill" && (
          <div
            className="absolute md:hidden flex rounded-[99px] items-center justify-center"
            style={{
              backgroundColor: STAMP_COLORS[index % STAMP_COLORS.length],
              right: "var(--talent-mobile-badge-right, -0.719rem)",
              top: "var(--talent-mobile-badge-top, -0.719rem)",
              paddingTop: "var(--talent-mobile-badge-pt, 0.129rem)",
              paddingBottom: "var(--talent-mobile-badge-pb, 0.516rem)",
              paddingLeft: "var(--talent-mobile-badge-px, 1.032rem)",
              paddingRight: "var(--talent-mobile-badge-px, 1.032rem)",
            }}
          >
            <p
              className="whitespace-nowrap font-agharti-regular-display leading-normal text-[#1a1a1a]"
              style={{ fontSize: "var(--talent-mobile-badge-font-size, 1.548rem)" }}
            >
              {categoryParts[0]}
            </p>
          </div>
        )}
      </article>
    );
  },
);

function SocialHandle({
  type,
  handle,
  href,
}: {
  type: "instagram" | "tiktok";
  handle: string;
  href: string | null;
}) {
  const textClassName = "truncate font-heading italic leading-normal text-[#1a1a1a]";
  const textStyle = { fontSize: "var(--talent-handle-size, clamp(0.75rem, 3.73cqw, 1.162rem))" };

  return (
    <div className="flex min-w-0 flex-1 items-center gap-[0.359rem] md:gap-2">
      <span className="flex size-[var(--talent-social-icon-size,7.84cqw)] max-h-[39.043px] max-w-[39.043px] min-h-6 min-w-6 max-md:min-h-[1.078rem] max-md:min-w-[1.078rem] shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-[#fff2e7]">
        <SocialIcon type={type} />
      </span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={textClassName}
          style={textStyle}
        >
          {handle}
        </a>
      ) : (
        <span className={textClassName} style={textStyle}>
          {handle}
        </span>
      )}
    </div>
  );
}

function SocialIcon({ type }: { type: "instagram" | "tiktok" }) {
  if (type === "instagram") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-[58%]"
        fill="currentColor"
      >
        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-[58%]"
      fill="currentColor"
    >
      <path d="M16.6 5.82a4.58 4.58 0 0 0 2.85.99V9a6.8 6.8 0 0 1-2.85-.62v5.87A5.25 5.25 0 1 1 11.35 9c.27 0 .53.02.78.06v2.24a3.08 3.08 0 1 0 2.34 2.99V2h2.13c.2 1.46.93 2.73 2.05 3.64a4.6 4.6 0 0 1-2.05-3.64v3.82Z" />
    </svg>
  );
}
