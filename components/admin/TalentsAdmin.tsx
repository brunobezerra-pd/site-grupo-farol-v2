"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowDownNarrowWideIcon, ArrowUpNarrowWideIcon, PlusIcon, SearchIcon, TriangleAlertIcon, UploadIcon, UserIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { saveSettingAction } from "@/app/admin/actions";
import { ImportSpreadsheet } from "@/components/admin/ImportSpreadsheet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Talent } from "@/types";

type TalentsAdminProps = {
  initialTalents: Talent[];
  initialMarqueeCount: string;
};

export function TalentsAdmin({
  initialTalents,
  initialMarqueeCount,
}: TalentsAdminProps) {
  const [query, setQuery] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [pendingPhotoFilter, setPendingPhotoFilter] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [marqueeCount, setMarqueeCount] = useState(initialMarqueeCount);
  const [isPending, startTransition] = useTransition();

  const pendingCount = useMemo(
    () => initialTalents.filter((t) => t.photo_pending).length,
    [initialTalents],
  );

  const filteredTalents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let result = normalizedQuery
      ? initialTalents.filter((talent) =>
          talent.name.toLowerCase().includes(normalizedQuery),
        )
      : [...initialTalents];

    if (pendingPhotoFilter) {
      result = result.filter((t) => t.photo_pending);
    }

    return result.sort((a, b) => {
      const cmp = a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
      });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [initialTalents, query, sortDir, pendingPhotoFilter]);

  function saveMarqueeCount() {
    startTransition(async () => {
      try {
        await saveSettingAction("marquee_count", marqueeCount);
        toast.success("Configuração salva.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Marquee</CardTitle>
          <CardDescription>
            Talentos em destaque aparecem primeiro. As vagas restantes são preenchidas pelos adicionados mais recentemente.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="marquee-count">
                Número de talentos no marquee
              </FieldLabel>
              <Input
                id="marquee-count"
                type="number"
                min={1}
                value={marqueeCount}
                onChange={(event) => setMarqueeCount(event.target.value)}
              />
              <FieldDescription>
                Recomendado: entre 8 e 20
              </FieldDescription>
            </Field>
          </FieldGroup>
          <div className="flex justify-end">
            <Button type="button" disabled={isPending} onClick={saveMarqueeCount}>
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>

      {showImport ? <ImportSpreadsheet /> : null}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Talentos</CardTitle>
            {pendingCount > 0 && (
              <button
                type="button"
                onClick={() => setPendingPhotoFilter((f) => !f)}
                className={cn(
                  "inline-flex shrink-0 items-center rounded-full pl-2 pr-2.5 py-1 text-xs font-medium transition-colors",
                  pendingPhotoFilter
                    ? "bg-amber-200 text-amber-800"
                    : "bg-amber-100 text-amber-700 hover:bg-amber-200",
                )}
              >
                <TriangleAlertIcon className="mr-1.5 size-3 shrink-0" />
                {pendingCount} sem foto
                <span
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    pendingPhotoFilter
                      ? "ml-1.5 w-3.5 opacity-100"
                      : "ml-0 w-0 opacity-0 pointer-events-none",
                  )}
                >
                  <XIcon className="size-3.5 shrink-0" />
                </span>
              </button>
            )}
          </div>
          <CardDescription>Busque, crie e edite talentos.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-2.5 top-2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nome"
                className="pl-8"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            >
              {sortDir === "asc" ? (
                <ArrowUpNarrowWideIcon data-icon="inline-start" />
              ) : (
                <ArrowDownNarrowWideIcon data-icon="inline-start" />
              )}
              {sortDir === "asc" ? "A–Z" : "Z–A"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowImport((value) => !value)}>
              <UploadIcon data-icon="inline-start" />
              Importar
            </Button>
            <Button render={<Link href="/admin/talents/new" />}>
              <PlusIcon data-icon="inline-start" />
              Novo talento
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filteredTalents.map((talent) => (
              <Link
                key={talent.id}
                href={`/admin/talents/${talent.id}`}
                className="overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-square bg-muted">
                  {talent.photo_url && !talent.photo_pending ? (
                    <Image
                      src={talent.photo_url}
                      alt={talent.name}
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserIcon className="size-8 text-muted-foreground" />
                    </div>
                  )}

                  {talent.featured && (
                    <span className="absolute right-1.5 top-1.5 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                      Destaque
                    </span>
                  )}

                  {talent.photo_pending && (
                    <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                      <TriangleAlertIcon className="size-2.5" />
                      Foto pendente
                    </span>
                  )}
                </div>

                <div className="px-2.5 py-2">
                  <p className="truncate text-[13px] font-medium">{talent.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {(talent.categories ?? []).join(", ") || "Sem categoria"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
