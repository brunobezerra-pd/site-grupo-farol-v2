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
          <div className="flex flex-col items-center justify-center gap-[1.5rem] xl:items-start">
            <div className="flex flex-col items-center justify-center gap-[0.5rem] xl:items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/LogoGrupoFarol--dark.svg"
                alt="Grupo Farol"
                className="h-[3.125rem] w-[9.881rem]"
              />
              <p className="max-w-[22rem] whitespace-normal text-center font-[var(--font-poppins)] text-[1rem] leading-[1.82] text-white md:max-xl:max-w-none md:max-xl:whitespace-nowrap md:max-xl:text-[1.125rem] xl:max-w-none xl:whitespace-nowrap xl:text-[clamp(1.25rem,1.25vw,1.5rem)]">
                ©2026 Grupo Farol. Todos os direitos reservados.
              </p>
            </div>
            
            <div className="flex items-center gap-[1.25rem]">
              <a
                href="https://www.instagram.com/farol.grupo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white transition-opacity hover:opacity-70"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-[1.5rem]"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/grupofarolcom/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white transition-opacity hover:opacity-70"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-[1.5rem]"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
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

        {scriptFooter ? (
          <div className="relative h-[16.303rem] w-full bg-[#d9d9d9] md:max-xl:h-[25.082rem] md:max-xl:w-[40rem] xl:h-[clamp(25rem,25.833vw,31rem)] xl:w-[clamp(38rem,41.198vw,49.4375rem)]">
            <div dangerouslySetInnerHTML={{ __html: scriptFooter }} />
          </div>
        ) : null}
        
        <div className="flex w-full flex-col items-center justify-center gap-2 border-t border-white/10 pt-[2rem]">
          <a
            href="/RTIS2025_Farol.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[var(--font-poppins)] text-[0.875rem] text-white/50 transition-colors hover:text-white"
          >
            RTIS 2025
          </a>
          <a
            href="#"
            className="ot-sdk-show-settings font-[var(--font-poppins)] text-[0.875rem] text-white/50 transition-colors hover:text-white"
          >
            Cookie Settings
          </a>
        </div>
      </div>
    </footer>
  );
}
