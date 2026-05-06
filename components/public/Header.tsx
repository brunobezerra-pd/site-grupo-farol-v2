"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "SoBre", href: "/#sobre" },
  { label: "TALENTOS", href: "/#talentos" },
  { label: "Como TrAbALHAMOS", href: "/#como-trabalhamos" },
  { label: "FAle conOsco", href: "/#contato" },
];

function HamburgerIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex h-[24px] w-[28.688px] flex-col justify-between"
    >
      <span className="block h-[4.56565px] w-full rounded-full bg-[#b1375b]" />
      <span className="block h-[4.56565px] w-full rounded-full bg-[#5c8dc9]" />
      <span className="block h-[4.56565px] w-full rounded-full bg-[#90c2ac]" />
    </span>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <header className="absolute left-0 top-0 z-40 w-full px-[32px] md:px-[64px] xl:hidden">
      <div className="flex h-[70px] w-full items-center justify-between md:h-[90px]">
        <Link href="/" aria-label="Grupo Farol">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/LogoGrupoFarol.svg"
            alt=""
            className="h-[32px] w-[101.178px]"
          />
        </Link>

        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
          className="public-button-lift flex h-[32px] w-[36px] items-center justify-center"
        >
          <HamburgerIcon />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-black/55 transition-opacity duration-300 ease-linear ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
      />

      <aside
        aria-label="Menu"
        className={`fixed bottom-0 right-0 top-0 z-50 w-[80vw] bg-[#fff2e7] py-[64px] transition-transform duration-300 ease-linear ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setIsOpen(false)}
          className="public-button-lift absolute right-[37px] top-[21px] flex size-[31px] items-center justify-center rounded-full border border-black px-[12px] py-[8px] font-foun-display text-[16px] leading-none text-[#1a1a1a]"
        >
          X
        </button>

        <nav
          aria-label="Menu principal"
          className="ml-[clamp(2.5rem,8.854vw,4.25rem)] flex w-[min(244px,calc(80vw-5rem))] flex-col items-start gap-[64px]"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="public-button-lift whitespace-nowrap font-foun-display text-[32px] leading-normal text-[#1a1a1a]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </header>
  );
}
