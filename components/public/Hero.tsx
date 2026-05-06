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

function LighthouseTower({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
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
  );
}

function Sparkle({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
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
  );
}

function Lighthouse() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="md:hidden">
        <div
          className="absolute left-0 top-[442px] h-[258px] w-full bg-[#fff2e7]"
          style={{
            clipPath: "polygon(0 24%, 100% 0, 100% 100%, 0 43%)",
          }}
        />
        <LighthouseTower className="absolute left-[-95px] top-[396px] h-[420px] w-[172px]" />
        <Sparkle className="absolute left-[198px] top-[538px] h-[72px] w-[72px]" />
      </div>

      <div className="hidden xl:block">
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
        <LighthouseTower className="absolute left-[68px] top-[165px] h-[915px] w-[374px]" />
        <Sparkle className="absolute left-[442px] top-[254px] h-[7.095rem] w-[7.092rem]" />
      </div>

      <div className="hidden md:max-xl:block">
        <div
          className="absolute left-0 top-[464px] h-[336px] w-full bg-[#fff2e7]"
          style={{
            clipPath: "polygon(0 34%, 100% 0, 100% 100%, 0 55%)",
          }}
        />
        <LighthouseTower className="absolute left-[-132px] top-[465px] h-[595px] w-[243px]" />
        <Sparkle className="absolute left-[213px] top-[617px] h-[72px] w-[72px]" />
      </div>
    </div>
  );
}

export function Hero({ buttonEnabled, buttonLabel, buttonUrl }: HeroProps) {
  return (
    <section className="relative h-[700px] overflow-hidden rounded-b-[48px] bg-[#e5a545] px-[32px] pb-[144px] text-[#1a1a1a] md:max-xl:h-[800px] md:max-xl:px-[64px] xl:h-[935.939px] xl:px-[120px]">
      <Lighthouse />

      <div className="relative z-10 hidden h-[90px] w-full items-center justify-end xl:flex">
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

      <div className="relative z-10 flex w-full items-start pt-[142px] md:max-xl:pt-[162px] xl:pt-[72px]">
        <div className="hidden h-[113.514px] w-[113.479px] shrink-0 xl:block" />
        <div className="flex min-w-0 flex-1 flex-col items-center xl:items-end">
          <div className="flex w-full flex-col items-center gap-[32px] pb-[32px] xl:w-auto xl:items-end xl:pb-[72px]">
            <h1 className="w-full text-center font-agharti-display uppercase leading-none tracking-normal xl:flex xl:h-[474px] xl:w-[1066px] xl:flex-col xl:justify-center xl:text-right">
              <span className="block text-[2.8rem] leading-[1.026] md:max-xl:text-[4rem] xl:text-[clamp(4rem,5vw,6rem)] xl:leading-none">
                A maior agência de creators da
              </span>
              <span className="block text-[6rem] leading-[1.026] md:max-xl:text-[11rem] xl:text-[clamp(12.333rem,15.417vw,18.5rem)] xl:leading-none">
                América Latina
              </span>
            </h1>
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-[16px] xl:w-auto xl:flex-row xl:gap-[56px]">
            {buttonEnabled ? (
              <Link
                href={buttonUrl}
                className="public-button-lift flex shrink-0 items-center justify-center rounded-[99px] bg-[#b9323b] px-[1.714rem] pb-[0.643rem] pt-[0.429rem] text-center font-agharti-display text-[2.286rem] leading-none tracking-[0.01em] text-[#1a1a1a] xl:px-[43.102px] xl:pb-[16.163px] xl:pt-[10.776px] xl:text-[clamp(2.395rem,2.993vw,3.592rem)]"
              >
                {buttonLabel}
              </Link>
            ) : null}
            <Link
              href="#contato"
              className="public-button-lift flex shrink-0 items-center justify-center rounded-[99px] bg-[#5c8dc9] px-[1.714rem] pb-[0.643rem] pt-[0.429rem] text-center font-agharti-display text-[2.286rem] leading-none tracking-[0.01em] text-[#1a1a1a] xl:px-[43.102px] xl:pb-[16.163px] xl:pt-[10.776px] xl:text-[clamp(2.395rem,2.993vw,3.592rem)]"
            >
              FaLE com O FARoL
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
