"use client";

import Image from "next/image";
import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";

import type { HeroMediaItem } from "@/types";

type HeroV2MediaCarouselProps = {
  mediaItems: HeroMediaItem[];
};

type HeroV2CarouselItem =
  | {
      kind: "media";
      item: HeroMediaItem;
    }
  | {
      kind: "placeholder";
      id: string;
    };

const DESKTOP_SLOT_COUNT = 6;
const MARQUEE_SPEED_PX_PER_SECOND = 44;

function getCarouselItems(mediaItems: HeroMediaItem[]): HeroV2CarouselItem[] {
  const carouselItems = mediaItems
    .filter((item) => item.placement === "carousel")
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({ kind: "media" as const, item }));

  if (carouselItems.length > 0) {
    return carouselItems;
  }

  return Array.from({ length: DESKTOP_SLOT_COUNT }, (_, index) => ({
    kind: "placeholder",
    id: `hero-v2-placeholder-${index}`,
  }));
}

const HeroV2MediaSlot = forwardRef<
  HTMLElement,
  {
    carouselItem: HeroV2CarouselItem;
  }
>(function HeroV2MediaSlot({ carouselItem }, ref) {
  const slotClassName =
    "h-[28.125rem] w-[15.8125rem] shrink-0 bg-[#e0d8d1] md:max-xl:h-[19.125rem] md:max-xl:w-[10.7525rem]";

  if (carouselItem.kind === "placeholder") {
    return (
      <article
        ref={ref}
        aria-hidden="true"
        className={slotClassName}
      />
    );
  }

  const item = carouselItem.item;

  if (item.media_type === "image" && item.source_url) {
    return (
      <article
        ref={ref}
        className={`relative overflow-hidden ${slotClassName}`}
      >
        <Image
          src={item.source_url}
          alt={item.alt_text || ""}
          fill
          unoptimized
          sizes="(min-width: 1280px) 15.8125rem, 10.7525rem"
          className="object-cover"
        />
      </article>
    );
  }

  if (
    (item.media_type === "video_file" || item.media_type === "video_url") &&
    item.source_url
  ) {
    return (
      <article
        ref={ref}
        className={`overflow-hidden ${slotClassName}`}
      >
        <video
          src={item.source_url}
          className="size-full object-cover"
          muted
          playsInline
          loop
          autoPlay
        />
      </article>
    );
  }

  if (item.media_type === "embed" && item.embed_code) {
    return (
      <article
        ref={ref}
        className={`overflow-hidden [&_iframe]:h-full [&_iframe]:w-full ${slotClassName}`}
        dangerouslySetInnerHTML={{ __html: item.embed_code }}
      />
    );
  }

  return (
    <article
      ref={ref}
      aria-hidden="true"
      className={slotClassName}
    />
  );
});

export function HeroV2MediaCarousel({
  mediaItems,
}: HeroV2MediaCarouselProps) {
  const carouselItems = getCarouselItems(mediaItems);
  const loopItems = [...carouselItems, ...carouselItems, ...carouselItems];
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLElement>(null);
  const secondLoopFirstCardRef = useRef<HTMLElement>(null);
  const offsetRef = useRef(0);
  const stepWidthRef = useRef(0);
  const loopWidthRef = useRef(0);
  const isArrowAnimatingRef = useRef(false);

  function applyTrackTransform(withTransition: boolean) {
    const track = trackRef.current;
    if (!track) return;

    track.style.transition = withTransition ? "transform 420ms ease" : "none";
    track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  }

  function normalizeOffset() {
    const loopWidth = loopWidthRef.current;
    if (loopWidth <= 0) return;

    while (offsetRef.current <= -2 * loopWidth) {
      offsetRef.current += loopWidth;
    }

    while (offsetRef.current > -loopWidth) {
      offsetRef.current -= loopWidth;
    }
  }

  useLayoutEffect(() => {
    function measureTrack() {
      const track = trackRef.current;
      const card = firstCardRef.current;
      const secondLoopCard = secondLoopFirstCardRef.current;
      if (!track || !card || !secondLoopCard || carouselItems.length === 0) return;

      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");
      stepWidthRef.current = card.offsetWidth + gap;
      loopWidthRef.current = secondLoopCard.offsetLeft - card.offsetLeft;
      offsetRef.current = -loopWidthRef.current;
      applyTrackTransform(false);
    }

    measureTrack();
    window.addEventListener("resize", measureTrack);

    return () => window.removeEventListener("resize", measureTrack);
  }, [carouselItems.length]);

  useEffect(() => {
    if (carouselItems.length <= 1) return;

    let frameId = 0;
    let previousTime = performance.now();

    function tick(currentTime: number) {
      const elapsedSeconds = (currentTime - previousTime) / 1000;
      previousTime = currentTime;

      if (!isArrowAnimatingRef.current) {
        offsetRef.current -= MARQUEE_SPEED_PX_PER_SECOND * elapsedSeconds;
        normalizeOffset();
        applyTrackTransform(false);
      }

      frameId = window.requestAnimationFrame(tick);
    }

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [carouselItems.length]);

  return (
    <div ref={viewportRef} className="w-full overflow-hidden">
      <div
        ref={trackRef}
        className="flex w-full shrink-0 items-center gap-[2.025rem] will-change-transform md:max-xl:gap-[3.87125rem]"
      >
        {loopItems.map((carouselItem, index) => (
          <HeroV2MediaSlot
            key={`${carouselItem.kind === "media" ? carouselItem.item.id : carouselItem.id}-${index}`}
            carouselItem={carouselItem}
            ref={
              index === 0
                ? firstCardRef
                : index === carouselItems.length
                  ? secondLoopFirstCardRef
                  : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
