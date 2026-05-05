import type { Metadata } from "next";
import Link from "next/link";

import { CastingExplorer } from "@/components/public/CastingExplorer";
import { getTalents } from "@/lib/talents";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Casting | Grupo Farol",
  description: "Conheça o casting de creators do Grupo Farol.",
};

export default async function CastingPage() {
  const talents = await getTalents();

  return (
    <main className="min-h-screen bg-[#b9323b] text-[#1a1a1a]">
      <section className="overflow-hidden px-8 pb-[96px] pt-8 md:px-16 md:pt-10 xl:px-[120px] xl:pt-12">
        <div className="mx-auto max-w-[1680px]">
          <Link
            href="/"
            className="mb-2 inline-flex rounded-full border-2 border-[#1a1a1a] px-5 pb-2 pt-1.5 font-agharti-regular-display text-2xl leading-none text-[#1a1a1a] transition duration-200 hover:-translate-y-0.5 hover:bg-[#1a1a1a] hover:text-[#fff2e7]"
          >
            Voltar para home
          </Link>
          <div className="mb-3 text-center">
            <h1
              className="font-agharti-regular-display leading-normal text-[#1a1a1a]"
              style={{ fontSize: "clamp(6rem, 9vw, 10.8rem)" }}
            >
              Nosso Casting
            </h1>
          </div>

          <CastingExplorer talents={talents} />
        </div>
      </section>
    </main>
  );
}
