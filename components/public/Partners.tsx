import type { Partner } from "@/types";

type PartnersProps = {
  partners: Partner[];
};

const PLACEHOLDER_PARTNERS = Array.from({ length: 9 }, (_, index) => index);

function LogoPlaceholder() {
  return (
    <div className="flex items-center gap-[0.625rem] text-[#303a3f]">
      <div className="grid grid-cols-2 gap-[0.1875rem]">
        {Array.from({ length: 6 }, (_, index) => (
          <span key={index} className="block size-[0.3125rem] rounded-full bg-current" />
        ))}
      </div>
      <span className="font-[var(--font-poppins)] text-[0.9375rem] font-bold leading-none">
        logoipsum
      </span>
    </div>
  );
}

export function Partners({ partners }: PartnersProps) {
  const hasPartners = partners.length > 0;

  return (
    <section
      id="parceiros"
      className="bg-[#fff2e7] px-[32px] py-[72px] text-[#1a1a1a] md:max-xl:px-[4rem] md:max-xl:py-[4.5rem] xl:px-[clamp(5rem,6.25vw,7.5rem)] xl:py-[clamp(4rem,3.75vw,4.5rem)]"
    >
      <div className="flex w-full flex-col items-start gap-[2rem] xl:gap-[clamp(5rem,5vw,6rem)]">
        <div className="flex w-full flex-col items-start gap-[2rem] xl:flex-row xl:items-center xl:justify-between xl:gap-[3rem]">
          <h2 className="w-full shrink-0 text-center font-agharti-black-display text-[3rem] uppercase leading-[0.94] md:max-xl:text-[5rem] xl:w-[clamp(38rem,43.125vw,51.75rem)] xl:text-[clamp(4.5rem,5.818vw,6.981rem)]">
            de quem somos parceiros
          </h2>

          <div
            aria-hidden="true"
            className="h-[3px] w-full flex-none bg-[#1a1a1a] xl:min-w-[12rem] xl:max-w-[47.3125rem] xl:flex-1"
          />
        </div>

        <div className="grid w-full grid-cols-3 items-center justify-center gap-[0.75rem] md:max-lg:gap-[1.25rem] lg:grid-cols-6 lg:gap-[1.25rem]">
          {hasPartners ? partners.map((partner, index) => (
            <div
              key={partner.id}
              className="flex h-[3.5rem] w-full items-center justify-center overflow-hidden rounded-[1rem] bg-white p-[0.75rem] md:max-lg:h-[7.5rem] md:max-lg:p-[2rem] lg:h-[clamp(6rem,6.25vw,7.5rem)] lg:p-[clamp(1.25rem,1.667vw,2rem)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={partner.logo_url}
                alt={`Parceiro ${index + 1}`}
                className="h-full w-full object-contain"
              />
            </div>
          )) : PLACEHOLDER_PARTNERS.map((index) => (
            <div
              key={index}
              className="flex h-[3.5rem] w-full items-center justify-center overflow-hidden rounded-[1rem] bg-white p-[0.75rem] md:max-lg:h-[7.5rem] md:max-lg:p-[2rem] lg:h-[clamp(6rem,6.25vw,7.5rem)] lg:p-[clamp(1.25rem,1.667vw,2rem)]"
            >
              <LogoPlaceholder />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
