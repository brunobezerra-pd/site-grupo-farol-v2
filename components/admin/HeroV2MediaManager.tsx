"use client";

import { useRef, useState, useTransition } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  FileVideoIcon,
  GripVerticalIcon,
  ImageIcon,
  LoaderCircleIcon,
  PlusIcon,
  RefreshCwIcon,
  SaveIcon,
  TrashIcon,
  UploadCloudIcon,
  VideoIcon,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import {
  createHeroMediaItemAction,
  deleteHeroMediaItemAction,
  updateHeroMediaItemAction,
  updateHeroMediaSortOrderAction,
} from "@/app/admin/actions";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type {
  HeroMediaItem,
  HeroMediaItemInsert,
  HeroMediaPlacement,
  HeroMediaType,
} from "@/types";

type HeroV2MediaManagerProps = {
  initialItems: HeroMediaItem[];
  isActive: boolean;
  isVersionPending: boolean;
  onActiveChange: (checked: boolean) => void;
};

type UploadStatus = "uploading" | "success" | "error";

type UploadTask = {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
};

type ExternalMediaType = Extract<HeroMediaType, "video_url" | "embed">;

type ExternalDraft = {
  mediaType: ExternalMediaType;
  value: string;
};

const CAROUSEL_ACCEPT = "image/png,image/jpeg,image/webp,video/mp4,video/webm";
const MOBILE_ACCEPT = "video/mp4,video/webm";
const CAROUSEL_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "video/mp4",
  "video/webm",
]);
const MOBILE_TYPES = new Set(["video/mp4", "video/webm"]);

function buildPayload(item: HeroMediaItem): HeroMediaItemInsert {
  return {
    placement: item.placement,
    media_type: item.media_type,
    source_url:
      item.media_type === "embed" ? null : item.source_url?.trim() || null,
    embed_code:
      item.media_type === "embed" ? item.embed_code?.trim() || null : null,
    alt_text: item.alt_text?.trim() || null,
    sort_order: item.sort_order,
  };
}

function getMediaType(file: File): HeroMediaType {
  return file.type.startsWith("video/") ? "video_file" : "image";
}

function getMediaTypeLabel(mediaType: HeroMediaType) {
  if (mediaType === "image") return "Imagem";
  if (mediaType === "video_file") return "Vídeo enviado";
  if (mediaType === "video_url") return "URL de vídeo";
  return "Embed";
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getSourceLabel(item: HeroMediaItem) {
  const source = item.media_type === "embed" ? item.embed_code : item.source_url;

  if (!source) {
    return "Sem origem";
  }

  try {
    const url = new URL(source);
    const pathname = decodeURIComponent(url.pathname);
    return pathname.split("/").filter(Boolean).pop() || url.hostname;
  } catch {
    return source;
  }
}

async function uploadFile(file: File) {
  const extension = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;
  const supabase = createClient();
  const { error } = await supabase.storage
    .from("hero-media")
    .upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("hero-media").getPublicUrl(path);
  return data.publicUrl;
}

function MediaThumb({ item }: { item: HeroMediaItem }) {
  if (item.media_type === "image" && item.source_url) {
    return (
      <div className="relative size-14 overflow-hidden rounded-lg border bg-muted">
        <Image
          src={item.source_url}
          alt={item.alt_text || ""}
          fill
          unoptimized
          sizes="3.5rem"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex size-14 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
      {item.media_type === "image" ? <ImageIcon /> : <FileVideoIcon />}
    </div>
  );
}

function UploadTaskList({
  tasks,
  onRetry,
}: {
  tasks: UploadTask[];
  onRetry: (task: UploadTask) => void;
}) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex flex-col gap-2 rounded-lg border bg-background p-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{task.file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(task.file.size)}
              </p>
            </div>
            {task.status === "uploading" ? (
              <LoaderCircleIcon className="animate-spin text-muted-foreground" />
            ) : null}
            {task.status === "success" ? (
              <CheckIcon className="text-primary" />
            ) : null}
            {task.status === "error" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRetry(task)}
              >
                <RefreshCwIcon data-icon="inline-start" />
                Tentar novamente
              </Button>
            ) : null}
          </div>

          {task.status === "uploading" ? (
            <Progress value={task.progress} />
          ) : null}

          {task.status === "error" ? (
            <p className="text-sm text-destructive">{task.error}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function UploadZone({
  title,
  description,
  accept,
  multiple,
  disabled,
  onFiles,
}: {
  title: string;
  description: string;
  accept: string;
  multiple: boolean;
  disabled: boolean;
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (disabled) {
      return;
    }

    onFiles(Array.from(event.dataTransfer.files));
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/40 p-6 text-center transition-colors",
        isDragging && "bg-muted",
      )}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <UploadCloudIcon className="text-muted-foreground" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          const files = Array.from(event.target.files || []);
          event.target.value = "";
          onFiles(files);
        }}
      />
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <UploadCloudIcon data-icon="inline-start" />
        Selecionar arquivos
      </Button>
    </div>
  );
}

function ExternalMediaForm({
  title,
  draft,
  isPending,
  onChange,
  onCancel,
  onSave,
}: {
  title: string;
  draft: ExternalDraft;
  isPending: boolean;
  onChange: (draft: ExternalDraft) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-background p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium">{title}</p>
        <Select
          value={draft.mediaType}
          onValueChange={(value) =>
            onChange({ ...draft, mediaType: value as ExternalMediaType })
          }
        >
          <SelectTrigger className="max-w-48">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video_url">URL de vídeo</SelectItem>
            <SelectItem value="embed">Embed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {draft.mediaType === "embed" ? (
        <Textarea
          value={draft.value}
          onChange={(event) =>
            onChange({ ...draft, value: event.target.value })
          }
          placeholder="<iframe ...></iframe>"
        />
      ) : (
        <Textarea
          value={draft.value}
          onChange={(event) =>
            onChange({ ...draft, value: event.target.value })
          }
          placeholder="https://..."
        />
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" disabled={isPending} onClick={onSave}>
          <SaveIcon data-icon="inline-start" />
          Salvar mídia
        </Button>
      </div>
    </div>
  );
}

function MediaListItem({
  item,
  index,
  total,
  isPending,
  onMove,
  onDelete,
}: {
  item: HeroMediaItem;
  index?: number;
  total?: number;
  isPending: boolean;
  onMove?: (direction: -1 | 1) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-3 rounded-lg border bg-background p-3">
      {onMove ? (
        <GripVerticalIcon className="shrink-0 text-muted-foreground" />
      ) : null}
      <MediaThumb item={item} />
      <div className="min-w-0 flex-1 basis-56">
        <p className="truncate text-sm font-medium">{getSourceLabel(item)}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{getMediaTypeLabel(item.media_type)}</Badge>
          {item.alt_text ? (
            <span className="truncate text-xs text-muted-foreground">
              {item.alt_text}
            </span>
          ) : null}
        </div>
      </div>
      {onMove && typeof index === "number" && typeof total === "number" ? (
        <div className="ml-auto flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isPending || index === 0}
            aria-label="Mover para cima"
            onClick={() => onMove(-1)}
          >
            <ArrowUpIcon />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isPending || index === total - 1}
            aria-label="Mover para baixo"
            onClick={() => onMove(1)}
          >
            <ArrowDownIcon />
          </Button>
        </div>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={isPending}
        aria-label="Remover mídia"
        onClick={onDelete}
      >
        <TrashIcon />
      </Button>
    </div>
  );
}

export function HeroV2MediaManager({
  initialItems,
  isActive,
  isVersionPending,
  onActiveChange,
}: HeroV2MediaManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [isCarouselUploadOpen, setIsCarouselUploadOpen] = useState(false);
  const [isMobileUploadOpen, setIsMobileUploadOpen] = useState(false);
  const [isCarouselExternalOpen, setIsCarouselExternalOpen] = useState(false);
  const [isMobileExternalOpen, setIsMobileExternalOpen] = useState(false);
  const [carouselExternalDraft, setCarouselExternalDraft] =
    useState<ExternalDraft>({
      mediaType: "video_url",
      value: "",
    });
  const [mobileExternalDraft, setMobileExternalDraft] =
    useState<ExternalDraft>({
      mediaType: "video_url",
      value: "",
    });
  const [carouselTasks, setCarouselTasks] = useState<UploadTask[]>([]);
  const [mobileTasks, setMobileTasks] = useState<UploadTask[]>([]);
  const [isPending, startTransition] = useTransition();

  const carouselItems = items
    .filter((item) => item.placement === "carousel")
    .sort((a, b) => a.sort_order - b.sort_order);
  const mobileItem = items.find((item) => item.placement === "mobile");

  function updateTask(
    placement: HeroMediaPlacement,
    taskId: string,
    updates: Partial<UploadTask>,
  ) {
    const setter =
      placement === "carousel" ? setCarouselTasks : setMobileTasks;

    setter((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task,
      ),
    );
  }

  async function uploadCarouselTask(task: UploadTask, sortOrder: number) {
    if (!CAROUSEL_TYPES.has(task.file.type)) {
      updateTask("carousel", task.id, {
        status: "error",
        progress: 0,
        error: "Formato inválido. Use PNG, JPG, WEBP, MP4 ou WEBM.",
      });
      return;
    }

    try {
      updateTask("carousel", task.id, { status: "uploading", progress: 35 });
      const publicUrl = await uploadFile(task.file);
      updateTask("carousel", task.id, { progress: 80 });
      const saved = await createHeroMediaItemAction({
        placement: "carousel",
        media_type: getMediaType(task.file),
        source_url: publicUrl,
        embed_code: null,
        alt_text: task.file.name,
        sort_order: sortOrder,
      });

      setItems((current) => [...current, saved]);
      updateTask("carousel", task.id, { status: "success", progress: 100 });
    } catch (error) {
      updateTask("carousel", task.id, {
        status: "error",
        progress: 0,
        error: error instanceof Error ? error.message : "Erro no upload.",
      });
    }
  }

  async function uploadMobileTask(task: UploadTask) {
    if (!MOBILE_TYPES.has(task.file.type)) {
      updateTask("mobile", task.id, {
        status: "error",
        progress: 0,
        error: "Formato inválido. Use MP4 ou WEBM.",
      });
      return;
    }

    try {
      updateTask("mobile", task.id, { status: "uploading", progress: 35 });
      const publicUrl = await uploadFile(task.file);
      updateTask("mobile", task.id, { progress: 80 });

      const payload: HeroMediaItemInsert = {
        placement: "mobile",
        media_type: "video_file",
        source_url: publicUrl,
        embed_code: null,
        alt_text: task.file.name,
        sort_order: 0,
      };
      const saved = mobileItem?.id
        ? await updateHeroMediaItemAction(mobileItem.id, payload)
        : await createHeroMediaItemAction(payload);

      setItems((current) => [
        ...current.filter((item) => item.placement !== "mobile"),
        saved,
      ]);
      updateTask("mobile", task.id, { status: "success", progress: 100 });
    } catch (error) {
      updateTask("mobile", task.id, {
        status: "error",
        progress: 0,
        error: error instanceof Error ? error.message : "Erro no upload.",
      });
    }
  }

  async function handleCarouselFiles(files: File[]) {
    if (files.length === 0) {
      return;
    }

    const tasks = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: "uploading" as const,
      progress: 15,
    }));
    const sortStart = carouselItems.length;

    setCarouselTasks((current) => [...tasks, ...current]);
    await Promise.all(
      tasks.map((task, index) => uploadCarouselTask(task, sortStart + index)),
    );
    setIsCarouselUploadOpen(false);
  }

  async function handleMobileFiles(files: File[]) {
    const file = files[0];

    if (!file) {
      return;
    }

    if (
      mobileItem &&
      !window.confirm("Substituir o vídeo mobile existente por este arquivo?")
    ) {
      return;
    }

    const task = {
      id: crypto.randomUUID(),
      file,
      status: "uploading" as const,
      progress: 15,
    };

    setMobileTasks((current) => [task, ...current]);
    await uploadMobileTask(task);
    setIsMobileUploadOpen(false);
  }

  function deleteItem(id: string) {
    startTransition(async () => {
      try {
        await deleteHeroMediaItemAction(id);
        setItems((current) => current.filter((item) => item.id !== id));
        toast.success("Mídia removida.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao remover.");
      }
    });
  }

  function moveCarouselItem(id: string, direction: -1 | 1) {
    const currentIndex = carouselItems.findIndex((item) => item.id === id);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= carouselItems.length) {
      return;
    }

    const reordered = [...carouselItems];
    const [movedItem] = reordered.splice(currentIndex, 1);
    reordered.splice(nextIndex, 0, movedItem);
    const orderedItems = reordered.map((item, index) => ({
      ...item,
      sort_order: index,
    }));

    setItems((current) => [
      ...current.filter((item) => item.placement !== "carousel"),
      ...orderedItems,
    ]);

    startTransition(async () => {
      try {
        await updateHeroMediaSortOrderAction(
          orderedItems.map((item) => ({
            id: item.id,
            sort_order: item.sort_order,
          })),
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao reordenar.",
        );
      }
    });
  }

  function saveMediaItems() {
    startTransition(async () => {
      try {
        await Promise.all(
          items.map((item) => updateHeroMediaItemAction(item.id, buildPayload(item))),
        );
        toast.success("Mídias salvas.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
      }
    });
  }

  function saveExternalMedia(
    placement: HeroMediaPlacement,
    draft: ExternalDraft,
  ) {
    const value = draft.value.trim();

    if (!value) {
      toast.error("Informe a URL ou o código embed.");
      return;
    }

    if (
      placement === "mobile" &&
      mobileItem &&
      !window.confirm("Substituir o vídeo mobile existente por esta mídia?")
    ) {
      return;
    }

    startTransition(async () => {
      try {
        const payload: HeroMediaItemInsert = {
          placement,
          media_type: draft.mediaType,
          source_url: draft.mediaType === "video_url" ? value : null,
          embed_code: draft.mediaType === "embed" ? value : null,
          alt_text: null,
          sort_order: placement === "carousel" ? carouselItems.length : 0,
        };
        const saved =
          placement === "mobile" && mobileItem?.id
            ? await updateHeroMediaItemAction(mobileItem.id, payload)
            : await createHeroMediaItemAction(payload);

        setItems((current) =>
          placement === "mobile"
            ? [
                ...current.filter((item) => item.placement !== "mobile"),
                saved,
              ]
            : [...current, saved],
        );

        if (placement === "carousel") {
          setCarouselExternalDraft({ mediaType: "video_url", value: "" });
          setIsCarouselExternalOpen(false);
        } else {
          setMobileExternalDraft({ mediaType: "video_url", value: "" });
          setIsMobileExternalOpen(false);
        }

        toast.success("Mídia salva.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
      }
    });
  }

  return (
    <Card
      className={cn(
        "min-w-0 max-w-full",
        isActive && "outline outline-2 outline-primary",
      )}
    >
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            <VideoIcon data-icon="inline-start" />
            Hero V2 mídia
          </CardTitle>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Ativo
            </span>
            <Switch
              checked={isActive}
              disabled={isVersionPending}
              onCheckedChange={onActiveChange}
              aria-label="Ativar Hero V2"
            />
          </div>
        </div>
        <CardDescription>
          Gerencie o carrossel desktop/tablet e o vídeo único mobile.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex min-w-0 flex-col gap-6">
        <section className="flex min-w-0 flex-col gap-4">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <ImageIcon className="text-muted-foreground" />
              <div className="min-w-0">
                <h3 className="font-medium">Desktop e tablet</h3>
                <p className="text-sm text-muted-foreground">
                  Itens ilimitados exibidos em loop no Hero V2.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {!isCarouselUploadOpen ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCarouselUploadOpen(true)}
                >
                  <PlusIcon data-icon="inline-start" />
                  Adicionar mídias
                </Button>
              ) : null}
              {!isCarouselExternalOpen ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCarouselExternalOpen(true)}
                >
                  <PlusIcon data-icon="inline-start" />
                  URL ou embed
                </Button>
              ) : null}
            </div>
          </div>

          {isCarouselUploadOpen ? (
            <UploadZone
              title="Arraste arquivos para o carrossel"
              description="PNG, JPG, WEBP, MP4 ou WEBM. Você pode enviar vários de uma vez."
              accept={CAROUSEL_ACCEPT}
              multiple
              disabled={isPending}
              onFiles={handleCarouselFiles}
            />
          ) : null}

          {isCarouselExternalOpen ? (
            <ExternalMediaForm
              title="Adicionar URL ou embed ao carrossel"
              draft={carouselExternalDraft}
              isPending={isPending}
              onChange={setCarouselExternalDraft}
              onCancel={() => setIsCarouselExternalOpen(false)}
              onSave={() =>
                saveExternalMedia("carousel", carouselExternalDraft)
              }
            />
          ) : null}

          <UploadTaskList
            tasks={carouselTasks}
            onRetry={(task) => uploadCarouselTask(task, carouselItems.length)}
          />

          <div className="flex min-w-0 flex-col gap-3">
            {carouselItems.length === 0 ? (
              <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                Nenhuma mídia cadastrada para o carrossel.
              </p>
            ) : (
              carouselItems.map((item, index) => (
                <MediaListItem
                  key={item.id}
                  item={item}
                  index={index}
                  total={carouselItems.length}
                  isPending={isPending}
                  onMove={(direction) => moveCarouselItem(item.id, direction)}
                  onDelete={() => deleteItem(item.id)}
                />
              ))
            )}
          </div>
        </section>

        <Separator />

        <section className="flex min-w-0 flex-col gap-4">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <VideoIcon className="text-muted-foreground" />
              <div className="min-w-0">
                <h3 className="font-medium">Mobile</h3>
                <p className="text-sm text-muted-foreground">
                  Um único vídeo horizontal, sem carrossel.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {!isMobileUploadOpen ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsMobileUploadOpen(true)}
                >
                  <PlusIcon data-icon="inline-start" />
                  Adicionar vídeo mobile
                </Button>
              ) : null}
              {!isMobileExternalOpen ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsMobileExternalOpen(true)}
                >
                  <PlusIcon data-icon="inline-start" />
                  URL ou embed
                </Button>
              ) : null}
            </div>
          </div>

          {isMobileUploadOpen ? (
            <UploadZone
              title="Arraste o vídeo mobile"
              description="Use um arquivo MP4 ou WEBM. Apenas um vídeo será mantido."
              accept={MOBILE_ACCEPT}
              multiple={false}
              disabled={isPending}
              onFiles={handleMobileFiles}
            />
          ) : null}

          {isMobileExternalOpen ? (
            <ExternalMediaForm
              title="Adicionar URL ou embed mobile"
              draft={mobileExternalDraft}
              isPending={isPending}
              onChange={setMobileExternalDraft}
              onCancel={() => setIsMobileExternalOpen(false)}
              onSave={() => saveExternalMedia("mobile", mobileExternalDraft)}
            />
          ) : null}

          <UploadTaskList tasks={mobileTasks} onRetry={uploadMobileTask} />

          {mobileItem ? (
            <MediaListItem
              item={mobileItem}
              isPending={isPending}
              onDelete={() => deleteItem(mobileItem.id)}
            />
          ) : (
            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              Nenhum vídeo mobile cadastrado.
            </p>
          )}
        </section>
      </CardContent>
      <CardFooter className="justify-end">
        <Button type="button" disabled={isPending} onClick={saveMediaItems}>
          <SaveIcon data-icon="inline-start" />
          {isPending ? "Salvando..." : "Salvar mídias"}
        </Button>
      </CardFooter>
    </Card>
  );
}
