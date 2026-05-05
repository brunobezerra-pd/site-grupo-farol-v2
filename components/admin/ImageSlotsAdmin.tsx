"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateImageSlotAction } from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import type { ImageSlot } from "@/types";

type ImageSlotsAdminProps = {
  initialSlots: ImageSlot[];
};

export function ImageSlotsAdmin({ initialSlots }: ImageSlotsAdminProps) {
  const [slots, setSlots] = useState(initialSlots);
  const [, startTransition] = useTransition();

  function updateSlotState(id: string, data: Partial<ImageSlot>) {
    setSlots((current) =>
      current.map((slot) => (slot.id === id ? { ...slot, ...data } : slot)),
    );

    startTransition(async () => {
      try {
        await updateImageSlotAction(id, data);
        toast.success("Imagem atualizada.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
      }
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {slots.map((slot) => (
        <Card key={slot.id}>
          <CardHeader>
            <CardTitle>{slot.label || slot.slot_key}</CardTitle>
            <CardDescription>{slot.slot_key}</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field orientation="horizontal">
                <FieldLabel htmlFor={`enabled-${slot.id}`}>Ativo</FieldLabel>
                <Switch
                  id={`enabled-${slot.id}`}
                  checked={Boolean(slot.enabled)}
                  onCheckedChange={(enabled) =>
                    updateSlotState(slot.id, { enabled })
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Imagem</FieldLabel>
                <ImageUpload
                  bucket="image-slots"
                  currentUrl={slot.image_url ?? ""}
                  onUpload={(imageUrl) => updateSlotState(slot.id, { image_url: imageUrl })}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
