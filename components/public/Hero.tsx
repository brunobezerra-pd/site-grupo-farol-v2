import Link from "next/link";

type HeroProps = {
  buttonEnabled: boolean;
  buttonLabel: string;
  buttonUrl: string;
};

const NAV_ITEMS = [
  { label: "SoBre", href: "/#sobre" },
  { label: "TALENTOS", href: "/#talentos" },
  { label: "Como TrAbALHAMOS", href: "/#como-trabalhamos" },
  { label: "FAle conOsco", href: "/#contato" },
];

function Lighthouse() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute bg-[#fff2e7]"
        style={{
          left: "180px",
          top: "72px",
          width: "calc(100vw - 178px)",
          height: "808px",
          clipPath: "polygon(0 291px, 100% 0, 100% 100%)",
        }}
      />
      <svg
        aria-hidden="true"
        className="absolute left-[68px] top-[165px] h-[915px] w-[374px]"
        fill="none"
        viewBox="0 0 374 915.01"
      >
        <g fill="#000">
          <path d="M106 166H266V240H106V166Z" fill="#fff2e7" />
          <path d="M374 816.005H333.701L270.903 333.435L323.819 263.511H300.475V241.048H278.684V107.429H95.3371V241.048H73.5457V263.511H50.2024L103.023 333.857L40.3097 816.016H0V864.711H33.975L27.4292 915.01H346.581L340.036 864.711H374V816.005ZM152.877 237.49H111.533V171.969H152.877V237.49ZM206.627 237.49H165.283V171.969H206.627V237.49ZM260.377 237.49H219.032V171.969H260.377V237.49Z" />
          <path d="M278.674 66.64H95.3371V100.399H278.674V66.64Z" />
          <path d="M188.848 0 74.5276 59.631H303.157L188.848 0Z" />
        </g>
      </svg>
      <svg
        aria-hidden="true"
        className="absolute left-[442px] top-[254px] h-[7.095rem] w-[7.092rem]"
        fill="none"
        viewBox="0 0 113.479 113.514"
      >
        <path
          d="M56.736 0V113.514M113.479 56.757H0M16.618 16.625L96.861 96.889M96.861 16.625L16.618 96.889"
          stroke="#1a1a1a"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}

export function Hero({ buttonEnabled, buttonLabel, buttonUrl }: HeroProps) {
  return (
    <section className="relative h-[935.939px] overflow-hidden rounded-b-[48px] bg-[#e5a545] px-[120px] pb-[144px] text-[#1a1a1a]">
      <Lighthouse />

      <div className="relative z-10 flex h-[90px] w-full items-center justify-end">
        <nav aria-label="Principal">
          <ul className="flex items-center gap-[64px]">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block whitespace-nowrap text-center font-foun-display leading-normal transition-opacity hover:opacity-70"
                  style={{ fontSize: "clamp(1.333rem, 1.667vw, 2rem)" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="relative z-10 flex w-full items-start pt-[72px]">
        <div className="h-[113.514px] w-[113.479px] shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col items-end">
          <div className="flex flex-col items-end gap-[32px] pb-[72px]">
            <h1 className="flex h-[474px] w-[1066px] flex-col justify-center text-right font-agharti-display uppercase leading-none tracking-normal">
              <span
                className="block"
                style={{ fontSize: "clamp(4rem, 5vw, 6rem)" }}
              >
                A maior agência de creators da
              </span>
              <span
                className="block"
                style={{ fontSize: "clamp(12.333rem, 15.417vw, 18.5rem)" }}
              >
                América Latina
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-[56px]">
            {buttonEnabled ? (
              <Link
                href={buttonUrl}
                className="flex shrink-0 items-center justify-center rounded-[99px] bg-[#b9323b] px-[43.102px] pb-[16.163px] pt-[10.776px] text-center font-agharti-display leading-none text-[#1a1a1a]"
                style={{
                  fontSize: "clamp(2.395rem, 2.993vw, 3.592rem)",
                  letterSpacing: "0.01em",
                }}
              >
                {buttonLabel}
              </Link>
            ) : null}
            <Link
              href="#contato"
              className="flex shrink-0 items-center justify-center rounded-[99px] bg-[#5c8dc9] px-[43.102px] pb-[16.163px] pt-[10.776px] text-center font-agharti-display leading-none text-[#1a1a1a]"
              style={{
                fontSize: "clamp(2.395rem, 2.993vw, 3.592rem)",
                letterSpacing: "0.01em",
              }}
            >
              FaLE com O FARoL
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
