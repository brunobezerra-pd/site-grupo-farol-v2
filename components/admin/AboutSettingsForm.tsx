"use client";

import { useState, useTransition } from "react";
import { InfoIcon } from "lucide-react";
import { toast } from "sonner";

import { saveSettingsAction } from "@/app/admin/actions";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type AboutSettingsFormProps = {
  initialSettings: Record<string, string>;
};

type AboutVersion = "v1" | "v2";

function getInitialAboutVersion(value: string): AboutVersion {
  return value === "v2" ? "v2" : "v1";
}

export function AboutSettingsForm({
  initialSettings,
}: AboutSettingsFormProps) {
  const [aboutVersion, setAboutVersion] = useState<AboutVersion>(
    getInitialAboutVersion(initialSettings.about_version),
  );
  const [isPending, startTransition] = useTransition();

  function saveAboutVersion(nextVersion: AboutVersion) {
    const previousVersion = aboutVersion;
    setAboutVersion(nextVersion);

    startTransition(async () => {
      try {
        await saveSettingsAction({ about_version: nextVersion });
        toast.success(`Sobre ${nextVersion.toUpperCase()} selecionado.`);
      } catch (error) {
        setAboutVersion(previousVersion);
        toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <InfoIcon data-icon="inline-start" />
          Sobre
        </CardTitle>
        <CardDescription>
          Escolha qual versão da primeira seção Sobre aparece na home.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field
            orientation="horizontal"
            className={cn(
              "rounded-lg border p-4",
              aboutVersion === "v1" && "outline outline-2 outline-primary",
            )}
          >
            <FieldContent>
              <FieldLabel htmlFor="about-version-v1">V1</FieldLabel>
              <FieldDescription>
                Mantém o layout atual da seção Sobre.
              </FieldDescription>
            </FieldContent>
            <Switch
              id="about-version-v1"
              checked={aboutVersion === "v1"}
              disabled={isPending}
              onCheckedChange={(checked) =>
                saveAboutVersion(checked ? "v1" : "v2")
              }
            />
          </Field>

          <Field
            orientation="horizontal"
            className={cn(
              "rounded-lg border p-4",
              aboutVersion === "v2" && "outline outline-2 outline-primary",
            )}
          >
            <FieldContent>
              <FieldLabel htmlFor="about-version-v2">V2</FieldLabel>
              <FieldDescription>
                Usa o novo layout estático baseado no Figma.
              </FieldDescription>
            </FieldContent>
            <Switch
              id="about-version-v2"
              checked={aboutVersion === "v2"}
              disabled={isPending}
              onCheckedChange={(checked) =>
                saveAboutVersion(checked ? "v2" : "v1")
              }
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
