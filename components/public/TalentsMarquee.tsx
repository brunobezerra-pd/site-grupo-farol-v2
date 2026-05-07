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
  className = "",
}: {
  direction: "previous" | "next";
  onClick: () => void;
  className?: string;
}) {
  const Icon = direction === "previous" ? ArrowLeft : ArrowRight;

  return (
    <button
      type="button"
      aria-label={direction === "previous" ? "Talento anterior" : "Próximo talento"}
      onClick={onClick}
      className={`public-button-lift z-10 flex items-center justify-center rounded-full bg-[#fff2e7] text-[#1a1a1a] hover:scale-105 ${
        direction === "previous" ? "left-[-40px]" : "right-[-40px]"
      } ${className}`}
    >
      <Icon strokeWidth={3} />
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
      className="relative overflow-hidden rounded-[48px] bg-[#b9323b] px-[32px] py-[40px] text-[#1a1a1a] md:py-[72px] md:max-xl:px-[4rem] md:max-xl:py-[4.5rem] xl:px-[120px]"
    >
      <div className="flex w-full flex-col items-start gap-[32px] md:gap-[72px] xl:gap-[105px]">
        <h2 className="w-full text-center font-agharti-regular-display text-[6rem] leading-normal text-[#1a1a1a] md:max-xl:text-[clamp(10rem,25.521vw,12.25rem)] xl:text-[clamp(12.667rem,15.833vw,19rem)]">
          Nosso Casting
        </h2>

        <div className="relative flex w-full flex-col items-center gap-[16px] pb-[32px] md:max-xl:gap-[2rem] md:max-xl:pb-[2rem] xl:block xl:pb-[72px]">
          <div
            ref={viewportRef}
            className="-mx-[32px] w-[calc(100%+64px)] overflow-hidden pt-[8px] md:max-xl:-mx-[4rem] md:max-xl:w-[calc(100%+8rem)] md:max-xl:pt-[3.9375rem] xl:-mx-[120px] xl:-mt-[72px] xl:w-[calc(100%+240px)] xl:pb-[8px] xl:pt-[72px]"
          >
            <div
              ref={trackRef}
              className="ml-[32px] flex w-[calc(100%_-_64px)] shrink-0 items-start gap-[32px] will-change-transform md:max-xl:ml-[4rem] md:max-xl:w-[calc(100%_-_8rem)] md:max-xl:gap-[6rem] xl:ml-[120px] xl:w-[calc(100%_-_240px)] xl:gap-[5.543%]"
            >
              {loopItems.map((talent, index) => (
                <TalentShowcaseCard
                  key={`${talent.id}-${index}`}
                  talent={talent}
                  index={index % carouselItems.length}
                  className="w-[22.372rem] max-md:[--talent-card-content-pb:1.797rem] max-md:[--talent-card-gap:1.033rem] max-md:[--talent-card-image-pad:1.078rem] max-md:[--talent-card-pad:0.539rem] max-md:[--talent-handle-size:0.836rem] max-md:[--talent-name-size:2.876rem] max-md:[--talent-social-icon-size:1.078rem] max-md:[--talent-stamp-font-size:2.157rem] max-md:[--talent-stamp-left:84.96%] max-md:[--talent-stamp-pad:0.449rem] max-md:[--talent-stamp-size:30.126%] max-md:[--talent-stamp-top:-9.41%] md:max-xl:w-[31.12rem] xl:w-[29.638%]"
                  mobileBadge="pill"
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
          <CarouselButton
            direction="previous"
            onClick={() => moveBy(-1)}
            className="absolute top-1/2 hidden size-[88px] -translate-y-1/2 drop-shadow-[0_6.286px_3.143px_rgba(0,0,0,0.25)] [&_svg]:size-[46px] xl:flex"
          />
          <CarouselButton
            direction="next"
            onClick={() => moveBy(1)}
            className="absolute top-1/2 hidden size-[88px] -translate-y-1/2 drop-shadow-[0_6.286px_3.143px_rgba(0,0,0,0.25)] [&_svg]:size-[46px] xl:flex"
          />
          <div className="flex w-full items-center justify-between md:max-xl:w-[40rem] xl:hidden">
            <CarouselButton
              direction="previous"
              onClick={() => moveBy(-1)}
              className="size-[32px] drop-shadow-[0_2.286px_1.143px_rgba(0,0,0,0.25)] md:max-xl:size-[88px] md:max-xl:drop-shadow-[0_6.286px_3.143px_rgba(0,0,0,0.25)] [&_svg]:size-[17px] md:max-xl:[&_svg]:size-[46px]"
            />
            <CarouselButton
              direction="next"
              onClick={() => moveBy(1)}
              className="size-[32px] drop-shadow-[0_2.286px_1.143px_rgba(0,0,0,0.25)] md:max-xl:size-[88px] md:max-xl:drop-shadow-[0_6.286px_3.143px_rgba(0,0,0,0.25)] [&_svg]:size-[17px] md:max-xl:[&_svg]:size-[46px]"
            />
          </div>
        </div>
      </div>

      <Link
        href="/casting"
        className="public-button-lift relative flex items-center justify-center gap-[0.839rem] whitespace-nowrap rounded-[99px] bg-[#b9323b] px-[1.677rem] pb-[0.629rem] pt-[0.419rem] text-center font-agharti-display text-[2.236rem] leading-none tracking-[0.01em] text-[#1a1a1a] transition-transform duration-200 ease-linear hover:-translate-y-[5px] md:max-xl:gap-[1.29rem] md:max-xl:px-[2.581rem] md:max-xl:pb-[0.968rem] md:max-xl:pt-[0.645rem] md:max-xl:text-[clamp(2.75rem,7.168vw,3.441rem)] xl:absolute xl:bottom-[-49.96px] xl:left-1/2 xl:-translate-x-1/2 xl:gap-[24px] xl:px-[48px] xl:pb-[18px] xl:pt-[12px] xl:text-[clamp(2.667rem,3.333vw,4rem)]"
      >
        CONHEÇA TODOS OS NOSSOS TALENTOS
        <span className="flex size-[1.957rem] shrink-0 items-center justify-center rounded-full border-[2.236px] border-black shadow-[0_2.236px_2.236px_rgba(0,0,0,0.25)] md:max-xl:size-[3.011rem] md:max-xl:border-[0.215rem] md:max-xl:shadow-[0_0.215rem_0.215rem_rgba(0,0,0,0.25)] xl:size-[56px] xl:border-4 xl:shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          <ArrowRight className="size-[1.042rem] md:max-xl:size-[1.603rem] xl:size-[30px]" strokeWidth={3} />
        </span>
      </Link>
    </section>
  );
}
