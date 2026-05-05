"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  createPartnerAction,
  deletePartnerAction,
  updatePartnerSortOrderAction,
} from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Partner } from "@/types";

type PartnersAdminProps = {
  initialPartners: Partner[];
};

export function PartnersAdmin({ initialPartners }: PartnersAdminProps) {
  const [partners, setPartners] = useState(initialPartners);
  const [isPending, startTransition] = useTransition();

  function handleUpload(url: string) {
    startTransition(async () => {
      try {
        const partner = await createPartnerAction(url);
        setPartners((current) => [...current, partner]);
        toast.success("Logo adicionado.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deletePartnerAction(id);
        setPartners((current) => current.filter((partner) => partner.id !== id));
        toast.success("Logo removido.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao remover.");
      }
    });
  }

  function handleSortChange(id: string, value: string) {
    const sortOrder = value === "" ? null : Number(value);
    setPartners((current) =>
      current.map((partner) =>
        partner.id === id ? { ...partner, sort_order: sortOrder } : partner,
      ),
    );
  }

  function handleSortBlur(id: string, sortOrder: number | null) {
    startTransition(async () => {
      try {
        await updatePartnerSortOrderAction(id, sortOrder);
        toast.success("Ordem salva.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Partners</CardTitle>
          <CardDescription>Envie novos logos para a grade.</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload bucket="partner-logos" onUpload={handleUpload} />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner) => (
          <Card key={partner.id}>
            <CardContent className="flex flex-col gap-4">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={partner.logo_url}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-contain p-4"
                />
              </div>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor={`sort-${partner.id}`}>Ordem</FieldLabel>
                  <Input
                    id={`sort-${partner.id}`}
                    type="number"
                    value={partner.sort_order ?? ""}
                    onChange={(event) =>
                      handleSortChange(partner.id, event.target.value)
                    }
                    onBlur={() =>
                      handleSortBlur(partner.id, partner.sort_order)
                    }
                  />
                </Field>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isPending}
                  onClick={() => handleDelete(partner.id)}
                >
                  <Trash2Icon data-icon="inline-start" />
                  Remover
                </Button>
              </FieldGroup>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
