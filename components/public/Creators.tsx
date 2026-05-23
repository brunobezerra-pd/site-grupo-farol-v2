import type { CSSProperties } from "react";

const BADGES = [
  {
    label: "HuMOR & CRIATIVIDADE",
    color: "#d96837",
    left: "-0.29%",
    top: "0%",
    rotate: "-3.94deg",
  },
  {
    label: "GASTRONOMIA",
    color: "#d1d362",
    left: "38.82%",
    top: "4.97%",
    rotate: "-0.74deg",
  },
  {
    label: "ESPORTES & GAMES",
    color: "#e5a545",
    left: "63.62%",
    top: "-7.95%",
    rotate: "5.06deg",
  },
  {
    label: "MODA & BELEZA",
    color: "#b1375b",
    left: "-0.38%",
    top: "42.71%",
    rotate: "5.06deg",
  },
  {
    label: "LIFESTYLE",
    color: "#5c8dc9",
    left: "28.56%",
    top: "52.64%",
    rotate: "-6.68deg",
  },
  {
    label: "PÁGINAS & COMUNIDADES",
    color: "#90c2ac",
    left: "47.1%",
    top: "52.65%",
    rotate: "-2.33deg",
  },
];

const TABLET_BADGES = [
  {
    label: "HuMOR & CRIATIVIDADE",
    color: "#d96837",
    left: "0%",
    top: "0%",
    rotate: "-3.94deg",
    size: "large",
  },
  {
    label: "PÁGINAS & COMUNIDADES",
    color: "#90c2ac",
    left: "45.5%",
    top: "2.5%",
    rotate: "-2.33deg",
    size: "small",
  },
  {
    label: "GASTRONOMIA",
    color: "#d1d362",
    left: "0%",
    top: "32%",
    rotate: "-0.74deg",
    size: "large",
  },
  {
    label: "ESPORTES & GAMES",
    color: "#e5a545",
    left: "46%",
    top: "33.5%",
    rotate: "5.06deg",
    size: "small",
  },
  {
    label: "MODA & BELEZA",
    color: "#b1375b",
    left: "0%",
    top: "66%",
    rotate: "5.06deg",
    size: "large",
  },
  {
    label: "LIFESTYLE",
    color: "#5c8dc9",
    left: "46%",
    top: "68%",
    rotate: "-6.68deg",
    size: "small",
  },
];

export function Creators() {
  return (
    <section className="overflow-hidden bg-[#fff2e7] px-[32px] py-[72px] text-[#1a1a1a] md:max-xl:px-[4rem] md:max-xl:py-[4.5rem] xl:px-[120px]">
      <div className="flex w-full flex-col items-start gap-[72px] xl:gap-[105px]">
        <div className="flex w-full flex-col items-start gap-[10px]">
          <div className="flex w-full items-center gap-[10px]">
            <div className="flex h-[66.535px] w-[198.891px] shrink-0 rotate-[-1.91deg] items-center justify-center">
              <p className="whitespace-nowrap text-center font-casual-human-display text-[clamp(3.25rem,12vw,4rem)] leading-[0.94] font-normal xl:text-[clamp(2.667rem,3.333vw,4rem)]">
                MAIS DE
              </p>
            </div>
            <div
              aria-hidden="true"
              className="hidden h-[29px] min-w-0 flex-1 overflow-hidden md:block"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent 0 14px, #1a1a1a 14px 17px, transparent 17px 30px)",
                backgroundPosition: "left center",
                backgroundRepeat: "repeat-x",
                backgroundSize: "30px 29px",
              }}
            />
          </div>

          <h2 className="flex w-full flex-col items-center gap-[10px] whitespace-nowrap text-center leading-[0.94] text-[#1a1a1a] xl:flex-row xl:items-end">
            <span className="font-agharti-regular-display text-[clamp(6rem,22vw,7rem)] md:max-xl:text-[clamp(10.5rem,26.563vw,12.75rem)] xl:text-[clamp(12.333rem,15.417vw,18.5rem)]">
              200 CREATORS.
            </span>
            <span className="font-agharti-tsc-display text-[clamp(4.25rem,15vw,5rem)] uppercase md:max-xl:text-[clamp(7.75rem,19.792vw,9.5rem)] xl:text-[clamp(7.333rem,9.167vw,11rem)]">
              Centenas de comunidades.
            </span>
          </h2>
        </div>

        <p className="w-full text-center font-heading text-[1.5rem] italic leading-normal text-[#1a1a1a] md:text-[2.1875rem] xl:text-[clamp(1.5rem,1.823vw,2.1875rem)]">
          Nosso casting reúne talentos que construíram comunidades reais em
          diferentes <strong className="font-bold">territórios</strong> da
          cultura digital.
        </p>

        <div
          className="relative hidden aspect-[1680/436.775] w-full xl:block"
          style={{ containerType: "inline-size" }}
        >
          {BADGES.map((badge) => (
            <div
              key={badge.label}
              className="absolute"
              style={
                {
                  left: badge.left,
                  top: badge.top,
                  rotate: badge.rotate,
                } as CSSProperties
              }
            >
              <div
                className="flex items-center justify-center rounded-[99px]"
                style={{
                  backgroundColor: badge.color,
                  paddingInline: "2.584cqw",
                  paddingBottom: "0.646cqw",
                  paddingTop: "0.129cqw",
                }}
              >
                <p
                  className="whitespace-nowrap font-agharti-regular-display leading-normal text-[#1a1a1a]"
                  style={{ fontSize: "clamp(4rem, 7.557cqw, 7.935rem)" }}
                >
                  {badge.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative hidden h-[17.75rem] w-full md:max-xl:block">
          {TABLET_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="absolute"
              style={
                {
                  left: badge.left,
                  top: badge.top,
                  rotate: badge.rotate,
                } as CSSProperties
              }
            >
              <div
                className={`flex items-center justify-center rounded-[99px] ${
                  badge.size === "large"
                    ? "px-[1.28rem] pb-[0.32rem] pt-[0.064rem]"
                    : "px-[1.148rem] pb-[0.287rem] pt-[0.057rem]"
                }`}
                style={{ backgroundColor: badge.color }}
              >
                <p
                  className={`whitespace-nowrap font-agharti-regular-display leading-normal text-[#1a1a1a] ${
                    badge.size === "large"
                      ? "text-[clamp(3rem,7.8vw,3.744rem)]"
                      : "text-[clamp(2.75rem,6.993vw,3.357rem)]"
                  }`}
                >
                  {badge.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid w-full grid-cols-2 gap-[16px] md:hidden">
          {TABLET_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex w-full items-center justify-center"
              style={{ rotate: badge.rotate } as CSSProperties}
            >
              <div
                className="flex w-auto items-center justify-center rounded-[99px]"
                style={{
                  backgroundColor: badge.color,
                  paddingInline: "clamp(0.8rem, 3.5vw, 1.25rem)",
                  paddingBottom: "clamp(0.25rem, 1vw, 0.4rem)",
                  paddingTop: "clamp(0.1rem, 0.5vw, 0.2rem)",
                }}
              >
                <p
                  className={`whitespace-nowrap font-agharti-regular-display leading-normal text-[#1a1a1a] ${
                    badge.size === "large"
                      ? "text-[clamp(1.15rem,4.6vw,1.4rem)]"
                      : "text-[clamp(1rem,4vw,1.2rem)]"
                  }`}
                >
                  {badge.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
