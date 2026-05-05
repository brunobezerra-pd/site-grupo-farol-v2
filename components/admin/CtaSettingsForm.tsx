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

type CtaSettingsFormProps = {
  initialSettings: Record<string, string>;
};

export function CtaSettingsForm({ initialSettings }: CtaSettingsFormProps) {
  const [contactLabel, setContactLabel] = useState(
    initialSettings.contact_button_label,
  );
  const [contactUrl, setContactUrl] = useState(
    initialSettings.contact_button_url,
  );
  const [talentsEnabled, setTalentsEnabled] = useState(
    initialSettings.talents_button_enabled === "true",
  );
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        await saveSettingsAction({
          contact_button_label: contactLabel,
          contact_button_url: contactUrl,
          talents_button_enabled: String(talentsEnabled),
        });
        toast.success("CTA salvo.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>CTA</CardTitle>
        <CardDescription>Configure os botões finais da home.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="contact-button-label">
                Texto do botão de contato
              </FieldLabel>
              <Input
                id="contact-button-label"
                value={contactLabel}
                onChange={(event) => setContactLabel(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-button-url">
                URL do botão de contato
              </FieldLabel>
              <Input
                id="contact-button-url"
                type="url"
                value={contactUrl}
                onChange={(event) => setContactUrl(event.target.value)}
              />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="talents-button-enabled">
                Exibir botão de talentos
              </FieldLabel>
              <Switch
                id="talents-button-enabled"
                checked={talentsEnabled}
                onCheckedChange={setTalentsEnabled}
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
