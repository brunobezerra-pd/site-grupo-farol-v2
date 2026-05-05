"use client";

import { forwardRef } from "react";
import { Camera, Music2 } from "lucide-react";

import type { Talent } from "@/types";

const STAMP_COLORS = ["#d1d362", "#d96837", "#5c8dc9"];

export function getTalentHandle(url: string | null) {
  if (!url) return null;

  return url
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, "@")
    .replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/, "@")
    .replace(/^@?/, "@")
    .replace(/\/$/, "");
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
};

export const TalentShowcaseCard = forwardRef<HTMLElement, TalentShowcaseCardProps>(
  function TalentShowcaseCard({ talent, index, className = "", onHoverChange }, ref) {
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
    const fallbackHandle = `@${name.toLowerCase().replace(/\s+/g, "")}`;

    return (
      <article
        ref={ref}
        className={`relative flex shrink-0 flex-col gap-[5.29cqw] rounded-[24px] bg-[#fff2e7] p-[0.714%] ${className}`}
        style={{ containerType: "inline-size" }}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
        onFocus={() => onHoverChange?.(true)}
        onBlur={() => onHoverChange?.(false)}
      >
        <div className="relative aspect-[473.917/390] w-full overflow-hidden rounded-[16px] bg-white p-[4.82%]">
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

        <div className="flex w-full flex-col gap-[5.29cqw] px-[4.82%] pb-[8.03%]">
          <h3
            className="w-full truncate font-agharti-bsc-display uppercase leading-none text-[#1a1a1a]"
            style={{ fontSize: "clamp(3.25rem, 19.25cqw, 6rem)" }}
          >
            {name}
          </h3>
          <div className="flex w-full items-center justify-between gap-4">
            <SocialHandle type="instagram" handle={instagram || fallbackHandle} />
            <SocialHandle type="tiktok" handle={tiktok || instagram || fallbackHandle} />
          </div>
        </div>

        <div
          className="absolute flex aspect-square w-[30.126%] items-center justify-center rounded-full p-[2.01%]"
          style={{
            backgroundColor: STAMP_COLORS[index % STAMP_COLORS.length],
            left: "84.96%",
            top: "-9.41%",
          }}
        >
          <p
            className="w-[124%] max-w-none rotate-[-20.07deg] whitespace-pre-line text-center font-agharti-duc-display leading-[0.82] text-[#1a1a1a]"
            style={{ fontSize: categorySize }}
          >
            {category}
          </p>
        </div>
      </article>
    );
  },
);

function SocialHandle({
  type,
  handle,
}: {
  type: "instagram" | "tiktok";
  handle: string;
}) {
  const Icon = type === "instagram" ? Camera : Music2;

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <span className="flex size-[7.84cqw] max-h-[39.043px] max-w-[39.043px] min-h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-[#fff2e7]">
        <Icon className="size-[58%]" strokeWidth={2.5} />
      </span>
      <span
        className="truncate font-heading italic leading-normal text-[#1a1a1a]"
        style={{ fontSize: "clamp(0.75rem, 3.73cqw, 1.162rem)" }}
      >
        {handle}
      </span>
    </div>
  );
}
