"use client";

import { useState, useTransition } from "react";
import { ChevronDownIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createTalentAction,
  deleteTalentAction,
  updateTalentAction,
} from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Talent, TalentInsert, TalentUpdate } from "@/types";

type TalentFormProps = {
  talent: Talent | null;
};

export function TalentForm({ talent }: TalentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: talent?.name ?? "",
    categories: (talent?.categories ?? []).join(", "),
    featured: Boolean(talent?.featured),
    photo_url: talent?.photo_url ?? "",
    description: talent?.description ?? "",
    instagram_url: talent?.instagram_url ?? "",
    tiktok_url: talent?.tiktok_url ?? "",
    followers_range: talent?.followers_range ?? "",
    location: talent?.location ?? "",
    gender: talent?.gender ?? "",
    dietary_restriction: talent?.dietary_restriction ?? "",
    has_pet: talent?.has_pet ?? "",
    birth_date: talent?.birth_date ?? "",
    civil_status: talent?.civil_status ?? "",
    lgbtqia: Boolean(talent?.lgbtqia),
    of_age: Boolean(talent?.of_age),
    has_children: Boolean(talent?.has_children),
  });

  function updateField<Key extends keyof typeof form>(
    key: Key,
    value: (typeof form)[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function buildPayload(): TalentInsert | TalentUpdate {
    return {
      name: form.name,
      categories: form.categories
        .split(",")
        .map((category) => category.trim())
        .filter(Boolean),
      featured: form.featured,
      photo_url: form.photo_url,
      description: form.description,
      instagram_url: form.instagram_url,
      tiktok_url: form.tiktok_url,
      followers_range: form.followers_range,
      location: form.location,
      gender: form.gender,
      dietary_restriction: form.dietary_restriction,
      has_pet: form.has_pet,
      birth_date: form.birth_date || null,
      civil_status: form.civil_status,
      lgbtqia: form.lgbtqia,
      of_age: form.of_age,
      has_children: form.has_children,
      photo_pending: false,
    };
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        if (talent) {
          await updateTalentAction(talent.id, buildPayload());
        } else {
          const createdTalent = await createTalentAction(
            buildPayload() as TalentInsert,
          );
          router.replace(`/admin/talents/${createdTalent.id}`);
        }

        toast.success("Talento salvo.");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
      }
    });
  }

  function handleDelete() {
    if (!talent) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteTalentAction(talent.id);
        toast.success("Talento removido.");
        router.replace("/admin/talents");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao remover.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{talent ? talent.name : "New Talent"}</CardTitle>
        <CardDescription>Preencha os dados do talento.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input
                id="name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="categories">Categorias</FieldLabel>
              <Input
                id="categories"
                value={form.categories}
                onChange={(event) =>
                  updateField("categories", event.target.value)
                }
                placeholder="moda, beleza, lifestyle"
              />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="featured">Featured</FieldLabel>
              <Switch
                id="featured"
                checked={form.featured}
                onCheckedChange={(value) => updateField("featured", value)}
              />
            </Field>
            <Field>
              <FieldLabel>Foto</FieldLabel>
              <ImageUpload
                bucket="talent-photos"
                currentUrl={form.photo_url}
                onUpload={(url) => updateField("photo_url", url)}
              />
            </Field>
            <Field>
              <FieldLabel>Descrição</FieldLabel>
              <RichTextEditor
                value={form.description}
                onChange={(value) => updateField("description", value)}
              />
            </Field>

            <Collapsible>
              <CollapsibleTrigger
                render={
                  <Button type="button" variant="outline" className="w-full" />
                }
              >
                Campos adicionais
                <ChevronDownIcon data-icon="inline-end" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <FieldGroup>
                  {[
                    ["instagram_url", "Instagram"],
                    ["tiktok_url", "TikTok"],
                    ["followers_range", "Faixa de seguidores"],
                    ["location", "Localização"],
                    ["gender", "Gênero"],
                    ["dietary_restriction", "Restrição alimentar"],
                    ["has_pet", "Pet"],
                    ["birth_date", "Data de nascimento"],
                    ["civil_status", "Estado civil"],
                  ].map(([key, label]) => (
                    <Field key={key}>
                      <FieldLabel htmlFor={key}>{label}</FieldLabel>
                      <Input
                        id={key}
                        type={key === "birth_date" ? "date" : "text"}
                        value={String(form[key as keyof typeof form])}
                        onChange={(event) =>
                          updateField(
                            key as keyof typeof form,
                            event.target.value as never,
                          )
                        }
                      />
                    </Field>
                  ))}
                  {[
                    ["lgbtqia", "LGBTQIA+"],
                    ["of_age", "Maior de idade"],
                    ["has_children", "Tem filhos"],
                  ].map(([key, label]) => (
                    <Field key={key} orientation="horizontal">
                      <FieldLabel htmlFor={key}>{label}</FieldLabel>
                      <Switch
                        id={key}
                        checked={Boolean(form[key as keyof typeof form])}
                        onCheckedChange={(value) =>
                          updateField(key as keyof typeof form, value as never)
                        }
                      />
                    </Field>
                  ))}
                </FieldGroup>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
              {talent ? (
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button type="button" variant="destructive">
                        <Trash2Icon data-icon="inline-start" />
                        Excluir
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir talento?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação remove o talento do banco de dados.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : null}
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
