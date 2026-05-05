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

export function Creators() {
  return (
    <section className="overflow-hidden bg-[#fff2e7] px-[120px] py-[72px] text-[#1a1a1a]">
      <div className="flex w-full flex-col items-start gap-[105px]">
        <div className="flex w-full flex-col items-start gap-[10px]">
          <div className="flex w-full items-center gap-[10px]">
            <div className="flex h-[66.535px] w-[198.891px] shrink-0 rotate-[-1.91deg] items-center justify-center">
              <p
                className="whitespace-nowrap text-center leading-[0.94]"
                style={{
                  fontFamily: "var(--font-casual-human)",
                  fontSize: "clamp(2.667rem, 3.333vw, 4rem)",
                  fontWeight: 400,
                }}
              >
                MAIS DE
              </p>
            </div>
            <div
              aria-hidden="true"
              className="h-[29px] min-w-0 flex-1 overflow-hidden"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent 0 14px, #1a1a1a 14px 17px, transparent 17px 30px)",
                backgroundPosition: "left center",
                backgroundRepeat: "repeat-x",
                backgroundSize: "30px 29px",
              }}
            />
          </div>

          <h2 className="flex w-full items-end gap-[10px] whitespace-nowrap text-center leading-[0.94] text-[#1a1a1a]">
            <span
              className="font-agharti-regular-display"
              style={{ fontSize: "clamp(12.333rem, 15.417vw, 18.5rem)" }}
            >
              200 CREATORS.
            </span>
            <span
              className="font-agharti-tsc-display uppercase"
              style={{ fontSize: "clamp(7.333rem, 9.167vw, 11rem)" }}
            >
              Centenas de comunidades.
            </span>
          </h2>
        </div>

        <p
          className="w-full text-center font-heading italic leading-normal text-[#1a1a1a]"
          style={{ fontSize: "clamp(1.5rem, 1.823vw, 2.1875rem)" }}
        >
          Nosso casting reúne talentos que construíram comunidades reais em
          diferentes <strong className="font-bold">territórios</strong> da
          cultura digital.
        </p>

        <div className="relative aspect-[1680/436.775] w-full" style={{ containerType: "inline-size" }}>
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
      </div>
    </section>
  );
}
