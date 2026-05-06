"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { TalentShowcaseCard } from "@/components/public/TalentShowcaseCard";
import type { Talent } from "@/types";

const PAGE_SIZE = 20;

type CastingExplorerProps = {
  talents: Talent[];
};

function getTalentCategoryParts(talent: Talent) {
  return (talent.categories ?? [])
    .flatMap((category) => category.split("/"))
    .map((part) => part.trim())
    .filter(Boolean);
}

export function CastingExplorer({ talents }: CastingExplorerProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isChanging, setIsChanging] = useState(false);

  const categories = useMemo(
    () =>
      Array.from(new Set(talents.flatMap(getTalentCategoryParts))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [talents],
  );

  const filteredTalents = useMemo(() => {
    if (!activeCategory) return talents;

    return talents.filter((talent) =>
      getTalentCategoryParts(talent).includes(activeCategory),
    );
  }, [activeCategory, talents]);

  const totalPages = Math.max(1, Math.ceil(filteredTalents.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visibleTalents = filteredTalents.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function transitionTo(next: () => void) {
    setIsChanging(true);
    window.setTimeout(() => {
      next();
      window.requestAnimationFrame(() => setIsChanging(false));
    }, 140);
  }

  function selectCategory(category: string | null) {
    if (category === activeCategory) return;

    transitionTo(() => {
      setActiveCategory(category);
      setCurrentPage(1);
    });
  }

  function selectPage(page: number) {
    if (page === safePage) return;
    transitionTo(() => setCurrentPage(page));
  }

  return (
    <>
      <div className="mb-9 flex flex-wrap items-center justify-center gap-3">
        <CategoryButton active={!activeCategory} onClick={() => selectCategory(null)}>
          Todos
        </CategoryButton>
        {categories.map((category) => (
          <CategoryButton
            key={category}
            active={activeCategory === category}
            onClick={() => selectCategory(category)}
          >
            {category}
          </CategoryButton>
        ))}
      </div>

      <div
        className={`transition duration-300 ease-out ${
          isChanging ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <p className="mb-10 text-center font-heading text-lg italic text-[#1a1a1a]/75">
          {filteredTalents.length} talento{filteredTalents.length !== 1 ? "s" : ""}
          {activeCategory ? ` em ${activeCategory}` : " no casting"}
        </p>

        {visibleTalents.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-12 gap-y-20 overflow-visible sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleTalents.map((talent, index) => (
              <TalentShowcaseCard
                key={talent.id}
                talent={talent}
                index={index}
                className="w-full"
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[48px] bg-white/50">
            <p className="font-agharti-display text-4xl uppercase">
              Nenhum talento encontrado
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 ? (
        <div className="mt-16 flex items-center justify-center gap-3">
          <PaginationButton
            disabled={safePage === 1}
            label="Página anterior"
            onClick={() => selectPage(Math.max(1, safePage - 1))}
          >
            <ArrowLeft className="size-6" strokeWidth={3} />
          </PaginationButton>
          <span className="font-agharti-display text-3xl leading-none">
            {safePage}/{totalPages}
          </span>
          <PaginationButton
            disabled={safePage === totalPages}
            label="Próxima página"
            onClick={() => selectPage(Math.min(totalPages, safePage + 1))}
          >
            <ArrowRight className="size-6" strokeWidth={3} />
          </PaginationButton>
        </div>
      ) : null}
    </>
  );
}

function CategoryButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`public-button-lift rounded-full px-6 pb-2 pt-1.5 font-agharti-regular-display text-3xl leading-none ${
        active
          ? "bg-[#1a1a1a] text-[#fff2e7]"
          : "border-2 border-[#1a1a1a] text-[#1a1a1a]"
      }`}
    >
      {children}
    </button>
  );
}

function PaginationButton({
  children,
  disabled,
  label,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="public-button-lift flex size-12 items-center justify-center rounded-full bg-[#1a1a1a] text-[#fff2e7] hover:scale-105 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
