"use client";

import { useState, useTransition } from "react";
import { MousePointerClickIcon } from "lucide-react";
import { toast } from "sonner";

import { saveSettingsAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type HeroSettingsFormProps = {
  initialSettings: Record<string, string>;
};

export function HeroSettingsForm({ initialSettings }: HeroSettingsFormProps) {
  const [buttonEnabled, setButtonEnabled] = useState(
    initialSettings.hero_button_enabled === "true",
  );
  const [buttonLabel, setButtonLabel] = useState(
    initialSettings.hero_button_label,
  );
  const [buttonUrl, setButtonUrl] = useState(initialSettings.hero_button_url);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        await saveSettingsAction({
          hero_button_enabled: String(buttonEnabled),
          hero_button_label: buttonLabel,
          hero_button_url: buttonUrl,
        });
        toast.success("Hero salvo.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground">
            <MousePointerClickIcon className="size-3" />
            Botão principal
          </span>
          <CardTitle>Hero</CardTitle>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            {/* Toggle row */}
            <Field orientation="horizontal" className="border-b pb-5">
              <FieldContent>
                <FieldLabel htmlFor="hero-button-enabled">
                  Exibir botão
                </FieldLabel>
                <FieldDescription>
                  Quando desativado, o botão não aparece na home
                </FieldDescription>
              </FieldContent>
              <Switch
                id="hero-button-enabled"
                checked={buttonEnabled}
                onCheckedChange={setButtonEnabled}
              />
            </Field>

            {/* Fields section */}
            <div
              className={cn(
                "flex flex-col gap-4 pt-1 transition-opacity",
                !buttonEnabled && "pointer-events-none opacity-50",
              )}
            >
              <Field>
                <FieldLabel htmlFor="hero-button-label">
                  Texto
                  <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-normal text-muted-foreground">
                    Visível na home
                  </span>
                </FieldLabel>
                <Input
                  id="hero-button-label"
                  value={buttonLabel}
                  onChange={(event) => setButtonLabel(event.target.value)}
                />
                <FieldDescription>
                  Recomendado: até 30 caracteres
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="hero-button-url">
                  URL de destino
                  <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-normal text-muted-foreground">
                    Link
                  </span>
                </FieldLabel>
                <Input
                  id="hero-button-url"
                  type="url"
                  value={buttonUrl}
                  onChange={(event) => setButtonUrl(event.target.value)}
                />
                <FieldDescription>
                  Pode ser uma URL interna (/casting) ou externa
                </FieldDescription>
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Actions row — outside the card */}
      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
