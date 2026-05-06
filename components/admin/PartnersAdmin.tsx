"use client";

import { useRef, useState, useTransition } from "react";
import { PlusIcon, UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import {
  createPartnerAction,
  deletePartnerAction,
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
import type { Partner } from "@/types";

type PartnersAdminProps = {
  initialPartners: Partner[];
};

export function PartnersAdmin({ initialPartners }: PartnersAdminProps) {
  const [partners, setPartners] = useState(initialPartners);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const supabase = createClient();
    const extension = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;
    const { error: uploadError } = await supabase.storage
      .from("partner-logos")
      .upload(path, file, { cacheControl: "31536000", upsert: false });

    setIsUploading(false);
    event.target.value = "";

    if (uploadError) {
      toast.error(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("partner-logos").getPublicUrl(path);

    startTransition(async () => {
      try {
        const partner = await createPartnerAction(data.publicUrl);
        setPartners((current) => [...current, partner]);
        toast.success("Logo adicionado.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
      }
    });
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
            accept="image/*"
            className="sr-only"
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
                {isUploading ? "Enviando..." : "Clique para enviar uma imagem"}
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {partners.map((partner) => (
              <div key={partner.id} className="group relative">
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg border bg-white">
                  <Image
                    src={partner.logo_url}
                    alt=""
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
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
                        onClick={() => handleDelete(partner.id)}
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
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
        </CardContent>
      </Card>
    </div>
  );
}
