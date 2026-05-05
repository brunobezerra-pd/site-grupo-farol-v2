"use client";

import { useMemo, useState, useTransition } from "react";
import { PlusIcon, SearchIcon, UploadIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { saveSettingAction } from "@/app/admin/actions";
import { ImportSpreadsheet } from "@/components/admin/ImportSpreadsheet";
import { Badge } from "@/components/ui/badge";
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
  const [showImport, setShowImport] = useState(false);
  const [marqueeCount, setMarqueeCount] = useState(initialMarqueeCount);
  const [isPending, startTransition] = useTransition();

  const filteredTalents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return initialTalents;
    }

    return initialTalents.filter((talent) =>
      talent.name.toLowerCase().includes(normalizedQuery),
    );
  }, [initialTalents, query]);

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
          <CardTitle>Marquee Settings</CardTitle>
          <CardDescription>
            Featured talents are shown first. Remaining slots are filled by most recently added.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="marquee-count">
                Number of talents in the marquee
              </FieldLabel>
              <Input
                id="marquee-count"
                type="number"
                min={1}
                value={marqueeCount}
                onChange={(event) => setMarqueeCount(event.target.value)}
              />
              <FieldDescription>
                Featured talents are shown first. Remaining slots are filled by most recently added.
              </FieldDescription>
            </Field>
            <Button type="button" disabled={isPending} onClick={saveMarqueeCount}>
              Salvar
            </Button>
          </FieldGroup>
        </CardContent>
      </Card>

      {showImport ? <ImportSpreadsheet /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Talentos</CardTitle>
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
            <Button type="button" variant="outline" onClick={() => setShowImport((value) => !value)}>
              <UploadIcon data-icon="inline-start" />
              Import
            </Button>
            <Button render={<Link href="/admin/talents/new" />}>
              <PlusIcon data-icon="inline-start" />
              New Talent
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {filteredTalents.map((talent) => (
              <Link
                key={talent.id}
                href={`/admin/talents/${talent.id}`}
                className="flex flex-col gap-2 rounded-lg border p-3 transition-colors hover:bg-muted sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{talent.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(talent.categories ?? []).join(", ") || "Sem categoria"}
                  </p>
                </div>
                {talent.featured ? <Badge>Featured</Badge> : null}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
