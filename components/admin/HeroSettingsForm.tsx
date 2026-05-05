"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { saveSettingsAction } from "@/app/admin/actions";
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
import { Switch } from "@/components/ui/switch";

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
    <Card>
      <CardHeader>
        <CardTitle>Hero</CardTitle>
        <CardDescription>Controle o botão principal da home.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="hero-button-enabled">
                Exibir botão
              </FieldLabel>
              <Switch
                id="hero-button-enabled"
                checked={buttonEnabled}
                onCheckedChange={setButtonEnabled}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="hero-button-label">Texto</FieldLabel>
              <Input
                id="hero-button-label"
                value={buttonLabel}
                onChange={(event) => setButtonLabel(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="hero-button-url">URL</FieldLabel>
              <Input
                id="hero-button-url"
                type="url"
                value={buttonUrl}
                onChange={(event) => setButtonUrl(event.target.value)}
              />
            </Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
