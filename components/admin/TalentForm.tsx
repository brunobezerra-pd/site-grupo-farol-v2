"use client";

import { useState, useTransition } from "react";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  SaveIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Talent, TalentCategory, TalentInsert, TalentUpdate } from "@/types";

type TalentFormProps = {
  categories: TalentCategory[];
  talent: Talent | null;
};

export function TalentForm({ categories, talent }: TalentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: talent?.name ?? "",
    categories: talent?.categories ?? [],
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

  function toggleCategory(categoryName: string) {
    updateField(
      "categories",
      form.categories.includes(categoryName)
        ? form.categories.filter((name) => name !== categoryName)
        : [...form.categories, categoryName],
    );
  }

  function buildPayload(): TalentInsert | TalentUpdate {
    return {
      name: form.name,
      categories: form.categories,
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
    if (!talent) return;

    startTransition(async () => {
      try {
        await deleteTalentAction(talent.id);
        toast.success("Talento removido.");
        router.replace("/admin/talents");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao remover.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <nav className="mb-1 flex items-center gap-1 text-sm text-muted-foreground">
            <span>Admin</span>
            <span>›</span>
            <Link href="/admin/talents" className="hover:text-foreground transition-colors">
              Talentos
            </Link>
            <span>›</span>
            <span className="text-foreground">
              {talent?.name ?? "Novo talento"}
            </span>
          </nav>
          <h1 className="text-xl font-semibold">
            {talent ? "Editar talento" : "Novo talento"}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            nativeButton={false}
            render={<Link href="/admin/talents" />}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            Voltar
          </Button>

          {talent && (
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
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Main data card */}
          <Card>
            <CardHeader className="gap-3">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground">
                Informações principais
              </span>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                {/* Nome */}
                <Field>
                  <FieldLabel htmlFor="name">Nome</FieldLabel>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    required
                  />
                </Field>

                {/* Categorias */}
                <Field>
                  <FieldLabel>Categorias</FieldLabel>
                  {categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2 rounded-lg border border-input bg-background p-2">
                      {categories.map((category) => {
                        const selected = form.categories.includes(category.name);

                        return (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => toggleCategory(category.name)}
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                              selected
                                ? "border-transparent text-[#1a1a1a] shadow-sm"
                                : "border-input bg-background text-muted-foreground hover:text-foreground"
                            }`}
                            style={{
                              backgroundColor: selected ? category.color : undefined,
                            }}
                            aria-pressed={selected}
                          >
                            {category.name}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
                      Cadastre categorias em Talentos › Categorias para selecionar aqui.
                    </div>
                  )}
                  {form.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {form.categories.map((categoryName) => {
                        const category = categories.find(
                          (item) => item.name === categoryName,
                        );

                        return (
                          <span
                            key={categoryName}
                            className="rounded-full px-2 py-0.5 text-[11px] font-medium text-[#1a1a1a]"
                            style={{
                              backgroundColor: category?.color ?? "#d1d362",
                            }}
                          >
                            {categoryName}
                          </span>
                        );
                      })}
                    </div>
                  ) : null}
                </Field>

                {/* Destaque toggle — bordered */}
                <Field orientation="horizontal" className="border-y py-4">
                  <FieldContent>
                    <FieldLabel htmlFor="featured">Destaque</FieldLabel>
                    <FieldDescription>
                      Aparece primeiro no marquee da home
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="featured"
                    checked={form.featured}
                    onCheckedChange={(value) =>
                      updateField("featured", value)
                    }
                  />
                </Field>

                {/* Descrição */}
                <Field>
                  <FieldLabel>Descrição</FieldLabel>
                  <RichTextEditor
                    value={form.description}
                    onChange={(value) => updateField("description", value)}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Collapsible additional fields */}
          <Collapsible className="group/collapsible">
            <Card>
              <CollapsibleTrigger
                type="button"
                className="flex w-full cursor-pointer items-start justify-between px-6 py-5 text-left"
              >
                <div>
                  <div className="text-sm font-semibold">Dados adicionais</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    Instagram, TikTok, seguidores, localização e mais
                  </div>
                </div>
                <ChevronDownIcon className="mt-0.5 size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="border-t pt-4">
                  <FieldGroup>
                    {(
                      [
                        ["instagram_url", "Instagram"],
                        ["tiktok_url", "TikTok"],
                        ["followers_range", "Faixa de seguidores"],
                        ["location", "Localização"],
                        ["gender", "Gênero"],
                        ["dietary_restriction", "Restrição alimentar"],
                        ["has_pet", "Pet"],
                        ["birth_date", "Data de nascimento"],
                        ["civil_status", "Estado civil"],
                      ] as const
                    ).map(([key, label]) => (
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
                    {(
                      [
                        ["lgbtqia", "LGBTQIA+"],
                        ["of_age", "Maior de idade"],
                        ["has_children", "Tem filhos"],
                      ] as const
                    ).map(([key, label]) => (
                      <Field key={key} orientation="horizontal">
                        <FieldLabel htmlFor={key}>{label}</FieldLabel>
                        <Switch
                          id={key}
                          checked={Boolean(form[key as keyof typeof form])}
                          onCheckedChange={(value) =>
                            updateField(
                              key as keyof typeof form,
                              value as never,
                            )
                          }
                        />
                      </Field>
                    ))}
                  </FieldGroup>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>

        {/* Right column — Photo card */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <ImageUpload
                bucket="talent-photos"
                currentUrl={form.photo_url}
                onUpload={(url) => updateField("photo_url", url)}
                square
                buttonLabel="Trocar foto"
                hintText="JPG ou PNG, mínimo 400×400px"
                placeholder={
                  <UserIcon className="size-10 text-muted-foreground" />
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions row */}
      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={isPending}>
          <SaveIcon data-icon="inline-start" />
          {isPending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
