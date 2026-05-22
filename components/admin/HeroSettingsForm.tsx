"use client";

import { useState, useTransition } from "react";
import { MousePointerClickIcon } from "lucide-react";
import { toast } from "sonner";

import { saveSettingsAction } from "@/app/admin/actions";
import { HeroV2MediaManager } from "@/components/admin/HeroV2MediaManager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import type { HeroMediaItem } from "@/types";

type HeroSettingsFormProps = {
  initialSettings: Record<string, string>;
  initialHeroMediaItems: HeroMediaItem[];
};

type HeroVersion = "v1" | "v2";

function getInitialHeroVersion(value: string): HeroVersion {
  return value === "v2" ? "v2" : "v1";
}

export function HeroSettingsForm({
  initialSettings,
  initialHeroMediaItems,
}: HeroSettingsFormProps) {
  const [heroVersion, setHeroVersion] = useState<HeroVersion>(
    getInitialHeroVersion(initialSettings.hero_version),
  );
  const [buttonEnabled, setButtonEnabled] = useState(
    initialSettings.hero_button_enabled === "true",
  );
  const [buttonLabel, setButtonLabel] = useState(
    initialSettings.hero_button_label,
  );
  const [buttonUrl, setButtonUrl] = useState(initialSettings.hero_button_url);
  const [isPending, startTransition] = useTransition();
  const [isVersionPending, startVersionTransition] = useTransition();

  function saveHeroVersion(nextVersion: HeroVersion) {
    const previousVersion = heroVersion;
    setHeroVersion(nextVersion);

    startVersionTransition(async () => {
      try {
        await saveSettingsAction({ hero_version: nextVersion });
        toast.success(`Hero ${nextVersion.toUpperCase()} selecionado.`);
      } catch (error) {
        setHeroVersion(previousVersion);
        toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
      }
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        await saveSettingsAction({
          hero_button_enabled: String(buttonEnabled),
          hero_button_label: buttonLabel,
          hero_button_url: buttonUrl,
        });
        toast.success("Botão do Hero salvo.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
      }
    });
  }

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-6">
      <form className="min-w-0" onSubmit={handleSubmit}>
        <Card
          className={cn(
            "min-w-0 max-w-full",
            heroVersion === "v1" && "outline outline-2 outline-primary",
          )}
        >
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="flex items-center gap-2">
                <MousePointerClickIcon data-icon="inline-start" />
                Botão principal
              </CardTitle>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Ativo
                </span>
                <Switch
                  checked={heroVersion === "v1"}
                  disabled={isVersionPending}
                  onCheckedChange={(checked) =>
                    saveHeroVersion(checked ? "v1" : "v2")
                  }
                  aria-label="Ativar Hero V1"
                />
              </div>
            </div>
            <CardDescription>
              Controla o CTA exibido no Hero V1.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FieldGroup>
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

              <div
                className={cn(
                  "flex flex-col gap-4 pt-1 transition-opacity",
                  !buttonEnabled && "pointer-events-none opacity-50",
                )}
              >
                <Field>
                  <FieldLabel htmlFor="hero-button-label">
                    Texto
                    <Badge variant="outline">Visível na home</Badge>
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
                    <Badge variant="outline">Link</Badge>
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
          <CardFooter className="justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <HeroV2MediaManager
        initialItems={initialHeroMediaItems}
        isActive={heroVersion === "v2"}
        isVersionPending={isVersionPending}
        onActiveChange={(checked) => saveHeroVersion(checked ? "v2" : "v1")}
      />
    </div>
  );
}
