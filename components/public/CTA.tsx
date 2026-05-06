import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CTAProps = {
  contactButtonLabel: string;
  contactButtonUrl: string;
  showTalentsButton: boolean;
  imageUrl?: string;
};

const SEPARATOR_MARKS = Array.from({ length: 42 }, (_, index) => index);

function SlashLine() {
  return (
    <div className="flex h-[1.75rem] min-w-0 flex-1 items-center overflow-hidden">
      <div className="flex min-w-max items-center gap-[0.875rem]">
        {SEPARATOR_MARKS.map((mark) => (
          <span
            key={mark}
            className="block h-[1.75rem] w-[2px] shrink-0 rotate-[-45deg] bg-[#1a1a1a]"
          />
        ))}
      </div>
    </div>
  );
}

function SectionSeparator() {
  return (
    <div
      aria-hidden="true"
      className="flex h-[5.5rem] w-full justify-center px-[2rem] md:max-xl:h-auto md:max-xl:px-[4rem] md:max-xl:py-[4rem] xl:h-auto xl:px-[clamp(5rem,6.25vw,7.5rem)] xl:py-[clamp(3rem,3.333vw,4rem)]"
    >
      <div className="flex w-full items-center justify-center gap-[3.5rem] md:max-xl:max-w-[40rem] md:max-xl:justify-start xl:max-w-[102rem] xl:gap-[clamp(2rem,2.917vw,3.5rem)]">
        <div className="hidden min-w-0 flex-1 xl:flex">
          <SlashLine />
        </div>
        <svg
          className="size-[5.5rem] shrink-0 xl:size-[clamp(3.5rem,4.583vw,5.5rem)]"
          fill="none"
          viewBox="0 0 88 88"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M44 2V86M86 44H2M14 14L74 74M74 14L14 74"
            stroke="#1a1a1a"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
        </svg>
        <div className="hidden min-w-0 flex-1 md:flex">
          <SlashLine />
        </div>
      </div>
    </div>
  );
}

export function CTA({
  contactButtonLabel,
  contactButtonUrl,
  showTalentsButton,
  imageUrl,
}: CTAProps) {
  void showTalentsButton;

  return (
    <>
      <SectionSeparator />
      <section
        id="contato"
        className="bg-[#fff2e7] px-[2rem] py-[4.5rem] text-[#1a1a1a] md:max-xl:px-[4rem] xl:px-[clamp(5rem,6.25vw,7.5rem)] xl:py-[clamp(4rem,3.75vw,4.5rem)]"
      >
        <div className="grid w-full grid-cols-1 items-start gap-[6rem] xl:grid-cols-2 xl:gap-[clamp(4rem,5vw,6rem)]">
          <div className="relative flex w-full flex-col items-center justify-center gap-[3rem] rounded-[3rem] bg-[#d1d362] px-[2.5rem] pb-[4.5rem] pt-[2.5rem] xl:min-h-[clamp(12.75rem,21.146vw,25.375rem)] xl:gap-[clamp(2.5rem,2.5vw,3rem)] xl:pt-[1rem]">
            <h2 className="rotate-[1.56deg] text-center font-casual-human-display text-[3rem] font-bold leading-[0.94] xl:text-[clamp(3rem,3.333vw,4rem)]">
              VAMOS CO-CRIAR JUNTOS?
            </h2>

            <div className="h-[3px] w-full bg-[#1a1a1a] md:max-xl:max-w-[80%] xl:w-[25.303rem] xl:max-w-[60%]" />

            <p className="w-full text-center font-heading text-[1.25rem] leading-[1.4] xl:max-w-[46.625rem] xl:text-[clamp(1.5rem,1.458vw,1.75rem)]">
              Quando o objetivo é construir conteúdo que deixa marca,{" "}
              <strong className="font-bold">
                estamos prontos para criar juntos.
              </strong>
            </p>

            <Link
              href={contactButtonUrl}
              className="public-button-lift absolute bottom-[-3.06rem] left-[calc(50%-0.1875rem)] flex -translate-x-1/2 items-center justify-center gap-[1.5rem] whitespace-nowrap rounded-[99px] bg-[#b1375b] px-[3rem] pb-[1.125rem] pt-[0.75rem] text-center font-agharti-display text-[2.25rem] uppercase leading-none tracking-[0.01em] text-[#1a1a1a] transition-transform duration-200 ease-linear hover:-translate-y-[5px] xl:left-1/2 xl:text-[clamp(2rem,3.333vw,4rem)]"
            >
              {contactButtonLabel}
              <span className="flex size-[1.75rem] shrink-0 items-center justify-center rounded-full border-2 border-black shadow-[0_2px_2px_rgba(0,0,0,0.25)] xl:size-[3.5rem] xl:border-4 xl:shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                <ArrowRight className="size-[0.932rem] xl:size-[1.875rem]" strokeWidth={3} />
              </span>
            </Link>
          </div>

          <div className="relative h-[31rem] w-full bg-[#d9d9d9] xl:aspect-[791/496] xl:h-auto">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
