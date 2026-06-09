"use client";

import { useState, useTransition } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import {
  createTalentCategoryAction,
  deleteTalentCategoryAction,
  updateTalentCategoriesAction,
} from "@/app/admin/actions";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { TalentCategory } from "@/types";

type TalentCategoriesAdminProps = {
  initialCategories: TalentCategory[];
};

type DraftCategory = Pick<TalentCategory, "id" | "name" | "color" | "sort_order">;

const DEFAULT_CATEGORY_COLOR = "#d1d362";

export function TalentCategoriesAdmin({
  initialCategories,
}: TalentCategoriesAdminProps) {
  const [categories, setCategories] = useState(
    initialCategories.map(toDraftCategory),
  );
  const [newCategory, setNewCategory] = useState({
    color: DEFAULT_CATEGORY_COLOR,
    name: "",
  });
  const [savedCategories, setSavedCategories] = useState(
    initialCategories.map(toDraftCategory),
  );
  const [isPending, startTransition] = useTransition();
  const hasUnsavedChanges = areCategoriesDirty(categories, savedCategories);

  function updateDraft<Key extends keyof DraftCategory>(
    id: string,
    key: Key,
    value: DraftCategory[Key],
  ) {
    setCategories((current) =>
      current.map((category) =>
        category.id === id ? { ...category, [key]: value } : category,
      ),
    );
  }

  function createCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        const category = await createTalentCategoryAction({
          color: newCategory.color,
          name: newCategory.name,
          sort_order: categories.length,
        });
        const draftCategory = toDraftCategory(category);
        setCategories((current) => [...current, draftCategory]);
        setSavedCategories((current) => [...current, draftCategory]);
        setNewCategory({ color: DEFAULT_CATEGORY_COLOR, name: "" });
        toast.success("Categoria criada.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao criar.");
      }
    });
  }

  function saveCategories() {
    startTransition(async () => {
      try {
        await updateTalentCategoriesAction(
          categories.map((category, index) => ({
            color: category.color,
            id: category.id,
            name: category.name,
            sort_order: index,
          })),
        );
        const saved = categories.map((category, index) => ({
          ...category,
          sort_order: index,
        }));
        setCategories(saved);
        setSavedCategories(saved);
        toast.success("Categorias salvas.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
      }
    });
  }

  function deleteCategory(id: string) {
    startTransition(async () => {
      try {
        await deleteTalentCategoryAction(id);
        setCategories((current) =>
          current
            .filter((category) => category.id !== id)
            .map((category, index) => ({ ...category, sort_order: index })),
        );
        setSavedCategories((current) =>
          current
            .filter((category) => category.id !== id)
            .map((category, index) => ({ ...category, sort_order: index })),
        );
        toast.success("Categoria removida.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao remover.");
      }
    });
  }

  function moveCategory(id: string, direction: -1 | 1) {
    const currentIndex = categories.findIndex((category) => category.id === id);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= categories.length) {
      return;
    }

    const reordered = [...categories];
    const [category] = reordered.splice(currentIndex, 1);
    reordered.splice(nextIndex, 0, category);
    const withSortOrder = reordered.map((item, index) => ({
      ...item,
      sort_order: index,
    }));
    setCategories(withSortOrder);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Categorias de talentos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Defina nome, cor e ordem das categorias usadas nos talentos e no site público.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova categoria</CardTitle>
          <CardDescription>
            Depois de criada, a categoria fica disponível no cadastro de talentos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={createCategory}>
            <FieldGroup className="flex-1 sm:flex-row">
              <Field>
                <FieldLabel htmlFor="new-category-name">Nome</FieldLabel>
                <Input
                  id="new-category-name"
                  value={newCategory.name}
                  onChange={(event) =>
                    setNewCategory((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                />
              </Field>
              <Field className="sm:max-w-36">
                <FieldLabel htmlFor="new-category-color">Cor</FieldLabel>
                <Input
                  id="new-category-color"
                  type="color"
                  value={newCategory.color}
                  onChange={(event) =>
                    setNewCategory((current) => ({
                      ...current,
                      color: event.target.value,
                    }))
                  }
                />
              </Field>
            </FieldGroup>
            <div className="flex items-end">
              <Button type="submit" disabled={isPending}>
                <PlusIcon data-icon="inline-start" />
                Criar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Categorias</CardTitle>
              <CardDescription>
                A ordem aqui controla a prioridade de exibição no site público.
              </CardDescription>
            </div>
            <Button
              type="button"
              disabled={isPending || !hasUnsavedChanges}
              onClick={saveCategories}
            >
              <SaveIcon data-icon="inline-start" />
              Salvar alterações
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {categories.length === 0 ? (
            <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
              Nenhuma categoria cadastrada.
            </p>
          ) : (
            categories.map((category, index) => (
              <div
                key={category.id}
                className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[auto_minmax(0,1fr)_8rem_auto] sm:items-end"
              >
                <div className="flex items-center gap-1 sm:pb-1">
                  <span className="flex size-7 items-center justify-center rounded-md bg-muted text-xs font-medium">
                    {index + 1}
                  </span>
                  <div className="flex">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={isPending || index === 0}
                      onClick={() => moveCategory(category.id, -1)}
                    >
                      <ArrowUpIcon />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={isPending || index === categories.length - 1}
                      onClick={() => moveCategory(category.id, 1)}
                    >
                      <ArrowDownIcon />
                    </Button>
                  </div>
                </div>

                <Field>
                  <FieldLabel htmlFor={`category-${category.id}-name`}>
                    Nome
                  </FieldLabel>
                  <Input
                    id={`category-${category.id}-name`}
                    value={category.name}
                    onChange={(event) =>
                      updateDraft(category.id, "name", event.target.value)
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor={`category-${category.id}-color`}>
                    Cor
                  </FieldLabel>
                  <Input
                    id={`category-${category.id}-color`}
                    type="color"
                    value={category.color}
                    onChange={(event) =>
                      updateDraft(category.id, "color", event.target.value)
                    }
                  />
                </Field>

                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          type="button"
                          variant="destructive"
                          disabled={isPending}
                        >
                          <Trash2Icon data-icon="inline-start" />
                          Excluir
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
                        <AlertDialogDescription>
                          A categoria será removida dos talentos que a usam.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          type="button"
                          variant="destructive"
                          onClick={() => deleteCategory(category.id)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}

          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((category) => (
                <span
                  key={category.id}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium text-[#1a1a1a]",
                  )}
                  style={{ backgroundColor: category.color }}
                >
                  {category.name}
                </span>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function areCategoriesDirty(
  categories: DraftCategory[],
  savedCategories: DraftCategory[],
) {
  return JSON.stringify(categories) !== JSON.stringify(savedCategories);
}


function toDraftCategory(category: TalentCategory): DraftCategory {
  return {
    color: category.color,
    id: category.id,
    name: category.name,
    sort_order: category.sort_order,
  };
}
