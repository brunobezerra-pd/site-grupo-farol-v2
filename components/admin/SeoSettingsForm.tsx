"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { saveSettingsAction } from "@/app/admin/actions";
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
import { Textarea } from "@/components/ui/textarea";

type SeoSettingsFormProps = {
  initialSettings: Record<string, string>;
};

export function SeoSettingsForm({ initialSettings }: SeoSettingsFormProps) {
  const [seoTitle, setSeoTitle] = useState(initialSettings.seo_title);
  const [seoDescription, setSeoDescription] = useState(
    initialSettings.seo_description,
  );
  const [ogTitle, setOgTitle] = useState(initialSettings.og_title);
  const [ogDescription, setOgDescription] = useState(
    initialSettings.og_description,
  );
  const [ogImageUrl, setOgImageUrl] = useState(initialSettings.og_image_url);
  const [isPending, startTransition] = useTransition();

  function saveSettings(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    startTransition(async () => {
      try {
        await saveSettingsAction({
          seo_title: seoTitle,
          seo_description: seoDescription,
          og_title: ogTitle,
          og_description: ogDescription,
          og_image_url: ogImageUrl,
        });
        toast.success("SEO salvo.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>
            Configure metatags e prévia de compartilhamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveSettings}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="seo-title">Título SEO</FieldLabel>
                <Input
                  id="seo-title"
                  value={seoTitle}
                  onChange={(event) => setSeoTitle(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="seo-description">
                  Descrição SEO
                </FieldLabel>
                <Textarea
                  id="seo-description"
                  value={seoDescription}
                  onChange={(event) => setSeoDescription(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="og-title">Título Open Graph</FieldLabel>
                <Input
                  id="og-title"
                  value={ogTitle}
                  onChange={(event) => setOgTitle(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="og-description">
                  Descrição Open Graph
                </FieldLabel>
                <Textarea
                  id="og-description"
                  value={ogDescription}
                  onChange={(event) => setOgDescription(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Imagem Open Graph</FieldLabel>
                <ImageUpload
                  bucket="og-images"
                  currentUrl={ogImageUrl}
                  onUpload={(url) => {
                    setOgImageUrl(url);
                    toast.info("Imagem enviada. Salve para publicar.");
                  }}
                />
              </Field>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Prévia</CardTitle>
          <CardDescription>Card de compartilhamento.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <div className="relative flex aspect-[1.91/1] items-center justify-center bg-muted">
              {ogImageUrl ? (
                <Image
                  src={ogImageUrl}
                  alt=""
                  fill
                  unoptimized
                  sizes="360px"
                  className="object-cover"
                />
              ) : (
                <span className="text-sm text-muted-foreground">Imagem</span>
              )}
            </div>
            <div className="flex flex-col gap-1 p-3">
              <p className="line-clamp-2 font-medium">
                {ogTitle || seoTitle || "Título"}
              </p>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {ogDescription || seoDescription || "Descrição"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
