import Image from "next/image";
import Link from "next/link";

import { HeroV2MediaCarousel } from "@/components/public/HeroV2MediaCarousel";
import type { HeroMediaItem } from "@/types";

type HeroV2Props = {
  mediaItems?: HeroMediaItem[];
};

const NAV_ITEMS = [
  { label: "SoBre", href: "/#sobre" },
  { label: "TALENTOS", href: "/#talentos" },
  { label: "Como TrAbALHAMOS", href: "/#como-trabalhamos" },
  { label: "FAle conOsco", href: "/#contato" },
];

function getMobileMediaItem(mediaItems: HeroMediaItem[]) {
  return mediaItems.find((item) => item.placement === "mobile");
}

function HeroV2MobileMedia({ item }: { item?: HeroMediaItem }) {
  const mediaClassName =
    "h-[15rem] w-[26.6666875rem] shrink-0 bg-[#e0d8d1]";

  if (!item) {
    return <div aria-hidden="true" className={mediaClassName} />;
  }

  if (
    (item.media_type === "video_file" || item.media_type === "video_url") &&
    item.source_url
  ) {
    return (
      <video
        src={item.source_url}
        className={`${mediaClassName} object-cover`}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  if (item.media_type === "embed" && item.embed_code) {
    return (
      <div
        className={`overflow-hidden [&_iframe]:size-full ${mediaClassName}`}
        dangerouslySetInnerHTML={{ __html: item.embed_code }}
      />
    );
  }

  return <div aria-hidden="true" className={mediaClassName} />;
}

export function HeroV2({ mediaItems = [] }: HeroV2Props) {
  const mobileMediaItem = getMobileMediaItem(mediaItems);

  return (
    <section className="flex flex-col items-start overflow-hidden bg-[#fff2e7] px-[2rem] text-[#1a1a1a] md:max-xl:h-[50rem] md:max-xl:px-[4rem] xl:h-[62.25rem] xl:px-[7.5rem]">
      <header className="flex h-[4.375rem] w-full shrink-0 items-center justify-between md:max-xl:h-[5.625rem] xl:h-[5.625rem]">
        <Link
          href="/"
          aria-label="Grupo Farol"
          className="relative h-[2rem] w-[6.323625rem] shrink-0 xl:h-[3.75rem] xl:w-[11.8568125rem]"
        >
          <Image
            src="/LogoGrupoFarol.svg"
            alt=""
            fill
            priority
            sizes="11.8568125rem"
            className="object-contain"
          />
        </Link>

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-[4rem]">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className="flex items-center justify-center">
                <Link
                  href={item.href}
                  className="block whitespace-nowrap text-center font-foun-display text-[2rem] leading-normal text-[#1a1a1a] transition-opacity hover:opacity-70"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          aria-label="Abrir menu"
          className="flex h-[2rem] w-[2.25rem] items-center justify-center xl:hidden"
        >
          <span
            aria-hidden="true"
            className="flex h-[1.5rem] w-[1.793rem] flex-col justify-between"
          >
            <span className="block h-[0.285353125rem] w-full rounded-full bg-[#1a1a1a]" />
            <span className="block h-[0.285353125rem] w-full rounded-full bg-[#1a1a1a]" />
            <span className="block h-[0.285353125rem] w-full rounded-full bg-[#1a1a1a]" />
          </span>
        </button>
      </header>

      <div className="flex w-full max-w-[26rem] shrink-0 items-start pt-[2rem] md:max-xl:hidden xl:hidden">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-[4.5rem]">
          <div className="flex w-full shrink-0 items-center justify-center">
            <HeroV2MobileMedia item={mobileMediaItem} />
          </div>

          <div className="relative flex w-full shrink-0 flex-col items-center gap-[1rem]">
            <h1 className="min-w-full whitespace-nowrap font-agharti-display text-[11rem] uppercase leading-none">
              <span className="mb-0 block leading-none">América</span>
              <span className="block leading-none">Latina</span>
            </h1>
            <div className="relative h-[0.931875rem] w-full max-w-[24.8125rem] shrink-0 overflow-hidden">
              <Image
                src="/hero-v2-decoration.svg"
                alt=""
                fill
                sizes="(max-width: 767px) calc(100vw - 4rem), 24.8125rem"
                className="object-fill"
              />
            </div>
            <div className="absolute left-0 right-0 top-[-2rem] flex h-[2.9005625rem] max-w-full rotate-[-1.37deg] items-center justify-center overflow-hidden">
              <div className="flex max-w-full items-center justify-center rounded-[6.1875rem] bg-[#d1d362] px-[1.75rem] pb-[0.625rem] pt-[0.125rem]">
                <p className="whitespace-nowrap font-casual-human-display text-[1.5rem] leading-[1.026] text-[#1a1a1a]">
                  A maior agência de creators da
                </p>
              </div>
            </div>
            <div className="absolute bottom-[3.465rem] right-[3.73rem] h-[4.5rem] w-[4.498625rem]">
              <Image
                src="/hero-v2-star.svg"
                alt=""
                fill
                sizes="4.5rem"
                className="object-fill"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden w-full shrink-0 flex-col gap-[5.5rem] pt-[4.5rem] md:max-xl:flex md:max-xl:gap-[4.5rem] xl:flex">
        <div className="relative left-1/2 w-screen -translate-x-1/2">
          <HeroV2MediaCarousel mediaItems={mediaItems} />
        </div>

        <div className="hidden w-full min-w-0 shrink-0 items-end gap-[1.5rem] xl:flex">
          <div className="relative flex shrink-0 flex-col items-end">
            <h1 className="whitespace-nowrap text-right font-agharti-display text-[18.5rem] uppercase leading-none">
              América
            </h1>
            <div className="absolute left-0 top-[-3rem] flex h-[4.1381875rem] w-[37.2545625rem] rotate-[-1.37deg] items-center justify-center">
              <div className="flex items-center justify-center rounded-[6.1875rem] bg-[#d1d362] px-[2.5rem] pb-[0.625rem] pt-[0.125rem]">
                <p className="whitespace-nowrap font-casual-human-display text-[2.461875rem] leading-[1.026] text-[#1a1a1a]">
                  A maior agência de creators da
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-[1.4606875rem] min-w-0 flex-1">
            <Image
              src="/hero-v2-decoration.svg"
              alt=""
              fill
              sizes="39.022rem"
              className="object-fill"
            />
          </div>

          <div className="relative flex shrink-0 flex-col items-end">
            <h1 className="whitespace-nowrap font-agharti-display text-[18.5rem] uppercase leading-none">
              Latina
            </h1>
            <div className="absolute right-[0.734375rem] top-[-5.765rem] h-[5.625rem] w-[5.6233125rem]">
              <Image
                src="/hero-v2-star.svg"
                alt=""
                fill
                sizes="5.625rem"
                className="object-fill"
              />
            </div>
          </div>
        </div>

        <div className="relative hidden w-full shrink-0 flex-col items-center gap-[1rem] md:max-xl:flex">
          <h1 className="whitespace-nowrap text-center font-agharti-display text-[11rem] uppercase leading-none">
            América Latina
          </h1>
          <div className="relative h-[1.510625rem] w-[40.3555625rem] shrink-0">
            <Image
              src="/hero-v2-decoration.svg"
              alt=""
              fill
              sizes="40.3555625rem"
              className="object-fill"
            />
          </div>
          <div className="absolute left-0 top-[-2rem] flex h-[3.22825rem] w-[27.9283125rem] rotate-[-1.37deg] items-center justify-center">
            <div className="flex items-center justify-center rounded-[6.1875rem] bg-[#d1d362] px-[2.5rem] pb-[0.625rem] pt-[0.125rem]">
              <p className="whitespace-nowrap font-casual-human-display text-[1.75rem] leading-[1.026] text-[#1a1a1a]">
                A maior agência de creators da
              </p>
            </div>
          </div>
          <div className="absolute right-[2rem] top-[-2rem] h-[3rem] w-[2.9990625rem]">
            <Image
              src="/hero-v2-star.svg"
              alt=""
              fill
              sizes="3rem"
              className="object-fill"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
