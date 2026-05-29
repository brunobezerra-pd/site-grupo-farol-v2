"use client";

import {
  type CSSProperties,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon, PlusIcon, UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import {
  createPartnerAction,
  deletePartnerAction,
  updatePartnerSortOrdersAction,
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Partner } from "@/types";

type PartnersAdminProps = {
  initialPartners: Partner[];
};

type SortablePartnerCardProps = {
  index: number;
  isPending: boolean;
  onDelete: (id: string) => void;
  partner: Partner;
};

const PARTNER_LOGO_ACCEPT = "image/png,image/svg+xml";
const PARTNER_LOGO_MAX_SIZE = 2 * 1024 * 1024;

function isValidPartnerLogo(file: File) {
  return (
    file.size <= PARTNER_LOGO_MAX_SIZE &&
    (file.type === "image/png" ||
      file.type === "image/svg+xml" ||
      file.name.toLowerCase().endsWith(".svg"))
  );
}

function SortablePartnerCard({
  index,
  isPending,
  onDelete,
  partner,
}: SortablePartnerCardProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: partner.id });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("group relative", isDragging && "z-10 opacity-80")}
    >
      <div className="relative aspect-[3/2] overflow-hidden rounded-lg border bg-white">
        <span className="absolute left-1 top-1 z-10 rounded-full bg-foreground/70 px-1.5 py-0.5 text-[12px] font-medium leading-none text-background">
          {index + 1}
        </span>
        <button
          type="button"
          aria-label={`Reordenar logo ${index + 1}`}
          className="absolute bottom-1 left-1 z-10 flex size-5 cursor-grab items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 shadow transition-opacity active:cursor-grabbing group-hover:opacity-100 focus-visible:opacity-100"
          {...attributes}
          {...listeners}
        >
          <GripVerticalIcon className="size-3" />
        </button>
        <Image
          src={partner.logo_url}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 33vw"
          className="object-contain p-3"
        />
      </div>
      <AlertDialog>
        <AlertDialogTrigger
          aria-label="Remover logo"
          className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 shadow transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          <XIcon className="size-3" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover logo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={() => onDelete(partner.id)}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function PartnersAdmin({ initialPartners }: PartnersAdminProps) {
  const [partners, setPartners] = useState(initialPartners);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragOriginRef = useRef<Partner[] | null>(null);
  const partnersRef = useRef(partners);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  useEffect(() => {
    partnersRef.current = partners;
  }, [partners]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setIsUploading(true);

    const supabase = createClient();
    const uploadedPartners: Partner[] = [];
    let failedUploads = 0;
    let nextSortOrder = partners.length;

    for (const file of files) {
      if (!isValidPartnerLogo(file)) {
        failedUploads += 1;
        continue;
      }

      const extension = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;
      const { error: uploadError } = await supabase.storage
        .from("partner-logos")
        .upload(path, file, { cacheControl: "31536000", upsert: false });

      if (uploadError) {
        failedUploads += 1;
        continue;
      }

      const { data } = supabase.storage.from("partner-logos").getPublicUrl(path);

      try {
        const partner = await createPartnerAction(data.publicUrl, nextSortOrder);
        uploadedPartners.push(partner);
        nextSortOrder += 1;
      } catch {
        failedUploads += 1;
      }
    }

    setIsUploading(false);
    event.target.value = "";

    if (uploadedPartners.length > 0) {
      setPartners((current) => [...current, ...uploadedPartners]);
    }

    if (uploadedPartners.length > 0 && failedUploads === 0) {
      toast.success(
        uploadedPartners.length === 1
          ? "Logo adicionado."
          : `${uploadedPartners.length} logos adicionados.`,
      );
      return;
    }

    if (uploadedPartners.length > 0) {
      toast.error(
        `${uploadedPartners.length} logo(s) adicionados. ${failedUploads} arquivo(s) não foram enviados.`,
      );
      return;
    }

    toast.error("Nenhum logo foi enviado. Use PNG ou SVG de até 2MB.");
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deletePartnerAction(id);
        setPartners((current) =>
          current.filter((partner) => partner.id !== id),
        );
        toast.success("Logo removido.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao remover.");
      }
    });
  }

  function reorderPartners(
    currentPartners: Partner[],
    activeId: string,
    overId: string,
  ) {
    const oldIndex = currentPartners.findIndex(
      (partner) => partner.id === activeId,
    );
    const newIndex = currentPartners.findIndex((partner) => partner.id === overId);

    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
      return currentPartners;
    }

    return arrayMove(currentPartners, oldIndex, newIndex).map(
      (partner, index) => ({
        ...partner,
        sort_order: index,
      }),
    );
  }

  function handleDragStart() {
    dragOriginRef.current = partnersRef.current;
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setPartners((current) => {
      const reorderedPartners = reorderPartners(
        current,
        String(active.id),
        String(over.id),
      );
      partnersRef.current = reorderedPartners;
      return reorderedPartners;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event;

    if (!over) {
      if (dragOriginRef.current) {
        setPartners(dragOriginRef.current);
      }
      dragOriginRef.current = null;
      return;
    }

    const reorderedPartners = partnersRef.current.map(
      (partner, index) => ({
        ...partner,
        sort_order: index,
      }),
    );

    setPartners(reorderedPartners);

    startTransition(async () => {
      try {
        await updatePartnerSortOrdersAction(
          reorderedPartners.map((partner) => ({
            id: partner.id,
            sort_order: partner.sort_order,
          })),
        );
      } catch (error) {
        if (dragOriginRef.current) {
          setPartners(dragOriginRef.current);
        }
        toast.error(
          error instanceof Error ? error.message : "Erro ao reordenar.",
        );
      }
    });

    dragOriginRef.current = null;
  }

  function handleDragCancel() {
    if (dragOriginRef.current) {
      setPartners(dragOriginRef.current);
      partnersRef.current = dragOriginRef.current;
    }
    dragOriginRef.current = null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Parceiros</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie os logos exibidos na seção de parceiros.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar logo</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept={PARTNER_LOGO_ACCEPT}
            className="sr-only"
            multiple
            onChange={handleFileChange}
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border py-10 transition-colors hover:border-border/80 hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-muted">
              <UploadIcon className="size-5 text-muted-foreground" />
            </span>
            <span className="flex flex-col items-center gap-1">
              <span className="text-sm font-semibold">
                {isUploading ? "Enviando..." : "Clique para enviar imagens"}
              </span>
              <span className="text-xs text-muted-foreground">
                PNG ou SVG com fundo transparente, até 2MB
              </span>
            </span>
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle>Logos cadastrados</CardTitle>
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {partners.length} parceiros
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={partners.map((partner) => partner.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
                {partners.map((partner, index) => (
                  <SortablePartnerCard
                    key={partner.id}
                    index={index}
                    isPending={isPending}
                    partner={partner}
                    onDelete={handleDelete}
                  />
                ))}

                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-[3/2] items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground transition-colors hover:border-border/80 hover:bg-muted/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                >
                  <PlusIcon className="size-4 shrink-0" />
                  Adicionar
                </button>
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}
