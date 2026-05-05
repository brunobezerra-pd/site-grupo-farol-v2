"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef } from "react";

import { TalentShowcaseCard } from "@/components/public/TalentShowcaseCard";
import type { Talent } from "@/types";

type TalentsMarqueeProps = {
  talents: Talent[];
};

const MARQUEE_SPEED_PX_PER_SECOND = 44;

function CarouselButton({
  direction,
  onClick,
}: {
  direction: "previous" | "next";
  onClick: () => void;
}) {
  const Icon = direction === "previous" ? ArrowLeft : ArrowRight;

  return (
    <button
      type="button"
      aria-label={direction === "previous" ? "Talento anterior" : "Próximo talento"}
      onClick={onClick}
      className={`absolute top-1/2 z-10 flex size-[88px] -translate-y-1/2 items-center justify-center rounded-full bg-[#fff2e7] text-[#1a1a1a] drop-shadow-[0_6.286px_3.143px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 ${
        direction === "previous" ? "left-[-40px]" : "right-[-40px]"
      }`}
    >
      <Icon className="size-[46px]" strokeWidth={3} />
    </button>
  );
}

export function TalentsMarquee({ talents }: TalentsMarqueeProps) {
  const carouselItems = talents;
  const loopItems = [...carouselItems, ...carouselItems, ...carouselItems];
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLElement>(null);
  const secondLoopFirstCardRef = useRef<HTMLElement>(null);
  const offsetRef = useRef(0);
  const stepWidthRef = useRef(0);
  const loopWidthRef = useRef(0);
  const isPausedRef = useRef(false);
  const isArrowAnimatingRef = useRef(false);
  const arrowTimeoutRef = useRef<number | null>(null);

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

      if (!isPausedRef.current && !isArrowAnimatingRef.current) {
        offsetRef.current -= MARQUEE_SPEED_PX_PER_SECOND * elapsedSeconds;
        normalizeOffset();
        applyTrackTransform(false);
      }

      frameId = window.requestAnimationFrame(tick);
    }

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
      if (arrowTimeoutRef.current !== null) {
        window.clearTimeout(arrowTimeoutRef.current);
      }
    };
  }, [carouselItems.length]);

  const setPaused = (isPaused: boolean) => {
    isPausedRef.current = isPaused;
  };

  const moveBy = (direction: 1 | -1) => {
    const stepWidth = stepWidthRef.current;
    if (stepWidth <= 0) return;

    if (arrowTimeoutRef.current !== null) {
      window.clearTimeout(arrowTimeoutRef.current);
    }

    isArrowAnimatingRef.current = true;
    offsetRef.current -= direction * stepWidth;
    applyTrackTransform(true);

    arrowTimeoutRef.current = window.setTimeout(() => {
      normalizeOffset();
      isArrowAnimatingRef.current = false;
      applyTrackTransform(false);
      arrowTimeoutRef.current = null;
    }, 430);
  };

  if (carouselItems.length === 0) return null;

  return (
    <section
      id="talentos"
      className="relative rounded-[48px] bg-[#b9323b] px-[120px] py-[72px] text-[#1a1a1a]"
    >
      <div className="flex w-full flex-col items-start gap-[105px]">
        <h2
          className="w-full text-center font-agharti-regular-display leading-normal text-[#1a1a1a]"
          style={{ fontSize: "clamp(12.667rem, 15.833vw, 19rem)" }}
        >
          Nosso Casting
        </h2>

        <div className="relative w-full pb-[72px]">
          <div
            ref={viewportRef}
            className="-mx-[120px] -mt-[72px] w-[calc(100%+240px)] overflow-hidden pb-[8px] pt-[72px]"
          >
            <div
              ref={trackRef}
              className="flex shrink-0 items-start gap-[5.543%] will-change-transform"
              style={{ marginLeft: "120px", width: "calc(100% - 240px)" }}
            >
              {loopItems.map((talent, index) => (
                <TalentShowcaseCard
                  key={`${talent.id}-${index}`}
                  talent={talent}
                  index={index % carouselItems.length}
                  className="w-[29.638%]"
                  onHoverChange={setPaused}
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
          <CarouselButton direction="previous" onClick={() => moveBy(-1)} />
          <CarouselButton direction="next" onClick={() => moveBy(1)} />
        </div>
      </div>

      <Link
        href="/casting"
        className="absolute bottom-[-49.96px] left-1/2 flex -translate-x-1/2 items-center justify-center gap-[24px] whitespace-nowrap rounded-[99px] bg-[#b9323b] px-[48px] pb-[18px] pt-[12px] text-center font-agharti-display leading-none tracking-[0.01em] text-[#1a1a1a]"
        style={{ fontSize: "clamp(2.667rem, 3.333vw, 4rem)" }}
      >
        CONHEÇA TODOS OS NOSSOS TALENTOS
        <span className="flex size-[56px] shrink-0 items-center justify-center rounded-full border-4 border-black shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          <ArrowRight className="size-[30px]" strokeWidth={3} />
        </span>
      </Link>
    </section>
  );
}
