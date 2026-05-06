import Link from "next/link";

type FooterProps = {
  scriptFooter?: string;
};

const NAV_ITEMS = [
  { label: "SoBre", href: "/#sobre" },
  { label: "TALENTOS", href: "/#talentos" },
  { label: "Como TrAbALHAMOS", href: "/#como-trabalhamos" },
  { label: "FAle conOsco", href: "/#contato" },
];

export function Footer({ scriptFooter }: FooterProps) {
  return (
    <footer
      className="bg-black px-[2rem] py-[4.5rem] text-white md:max-xl:px-[4rem] xl:px-[clamp(5rem,6.25vw,7.5rem)] xl:py-[clamp(4rem,3.75vw,4.5rem)]"
    >
      <div className="flex w-full flex-col items-center gap-[6rem] xl:gap-[clamp(5rem,5vw,6rem)]">
        <div className="flex w-full flex-col items-center justify-center gap-[3rem] xl:flex-row xl:justify-between xl:gap-[4rem]">
          <div className="flex flex-col items-center justify-center gap-[0.5rem] xl:items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/LogoGrupoFarol--dark.svg"
              alt="Grupo Farol"
              className="h-[3.125rem] w-[9.881rem]"
            />
            <p className="whitespace-nowrap text-center font-[var(--font-poppins)] text-[1rem] leading-[1.82] text-white md:max-xl:text-[1.125rem] xl:text-[clamp(1.25rem,1.25vw,1.5rem)]">
              ©2026 Grupo Farol. Todos os direitos reservados.
            </p>
          </div>

          <nav aria-label="Rodapé" className="w-full xl:w-auto">
            <ul className="flex w-full flex-col items-center justify-center gap-[1rem] md:max-xl:flex-row md:max-xl:justify-between md:max-xl:gap-[2rem] xl:w-auto xl:flex-row xl:gap-[2rem]">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block whitespace-nowrap text-center font-foun-display text-[1.5rem] leading-normal text-white transition-opacity hover:opacity-70 xl:text-[clamp(1.25rem,1.25vw,1.5rem)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="relative h-[16.303rem] w-full bg-[#d9d9d9] md:max-xl:h-[25.082rem] md:max-xl:w-[40rem] xl:h-[clamp(25rem,25.833vw,31rem)] xl:w-[clamp(38rem,41.198vw,49.4375rem)]" />
      </div>

      {scriptFooter ? (
        <div dangerouslySetInnerHTML={{ __html: scriptFooter }} />
      ) : null}
    </footer>
  );
}
