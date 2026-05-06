"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
  UserIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createTalentAction,
  deleteTalentAction,
  getCategoriesAction,
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
  const [chipInput, setChipInput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [categoriesFetched, setCategoriesFetched] = useState(false);
  const categoryContainerRef = useRef<HTMLDivElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryContainerRef.current &&
        !categoryContainerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function openDropdown() {
    setDropdownOpen(true);
    if (!categoriesFetched) {
      const cats = await getCategoriesAction();
      setAllCategories(cats);
      setCategoriesFetched(true);
    }
  }

  const chips = form.categories
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  function updateField<Key extends keyof typeof form>(
    key: Key,
    value: (typeof form)[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function addChip(value: string) {
    const trimmed = value.trim();
    if (!trimmed || chips.includes(trimmed)) {
      setChipInput("");
      return;
    }
    updateField("categories", [...chips, trimmed].join(", "));
    setChipInput("");
  }

  function removeChip(chip: string) {
    updateField(
      "categories",
      chips.filter((c) => c !== chip).join(", "),
    );
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

                {/* Categorias — combobox com chips */}
                <Field>
                  <FieldLabel>Categorias</FieldLabel>
                  <div ref={categoryContainerRef} className="relative">
                    {/* Input area */}
                    <div
                      className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 cursor-text"
                      onClick={() => categoryInputRef.current?.focus()}
                    >
                      {chips.map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex items-center gap-1 rounded-md border border-input bg-muted px-2 py-0.5 text-xs font-medium"
                        >
                          {chip}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeChip(chip);
                            }}
                            className="ml-0.5 rounded hover:text-destructive focus:outline-none"
                          >
                            <XIcon className="size-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        ref={categoryInputRef}
                        type="text"
                        value={chipInput}
                        onChange={(e) => {
                          setChipInput(e.target.value);
                          if (!dropdownOpen) setDropdownOpen(true);
                        }}
                        onFocus={openDropdown}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            e.preventDefault();
                            setDropdownOpen(false);
                            return;
                          }
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (chipInput.trim()) addChip(chipInput);
                            return;
                          }
                          if (
                            e.key === "Backspace" &&
                            chipInput === "" &&
                            chips.length > 0
                          ) {
                            removeChip(chips[chips.length - 1]);
                          }
                        }}
                        placeholder={
                          chips.length === 0
                            ? "Buscar ou criar categoria..."
                            : ""
                        }
                        className="min-w-[160px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      />
                    </div>

                    {/* Dropdown */}
                    {dropdownOpen && (() => {
                      const filtered = allCategories.filter(
                        (cat) =>
                          !chips.includes(cat) &&
                          cat.toLowerCase().includes(chipInput.trim().toLowerCase()),
                      );
                      const showCreate =
                        chipInput.trim().length > 0 &&
                        !chips.includes(chipInput.trim()) &&
                        !allCategories.some(
                          (c) =>
                            c.toLowerCase() === chipInput.trim().toLowerCase(),
                        );

                      if (filtered.length === 0 && !showCreate) return null;

                      return (
                        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-auto rounded-lg border bg-popover shadow-md">
                          {filtered.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                addChip(cat);
                                setChipInput("");
                                setDropdownOpen(true);
                              }}
                            >
                              {cat}
                            </button>
                          ))}
                          {showCreate && (
                            <button
                              type="button"
                              className="flex w-full items-center gap-1.5 border-t px-3 py-1.5 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                addChip(chipInput);
                              }}
                            >
                              <PlusIcon className="size-3.5 shrink-0" />
                              Criar:{" "}
                              <span className="font-medium text-foreground">
                                {chipInput.trim()}
                              </span>
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </div>
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
