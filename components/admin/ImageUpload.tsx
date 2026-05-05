"use client";

import { useRef, useState } from "react";
import { ImageIcon, UploadIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type ImageUploadProps = {
  bucket: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
};

export function ImageUpload({
  bucket,
  currentUrl,
  onUpload,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setIsUploading(true);

    const supabase = createClient();
    const extension = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });

    setIsUploading(false);
    event.target.value = "";

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onUpload(data.publicUrl);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex aspect-[1.91/1] w-full items-center justify-center overflow-hidden rounded-lg border bg-muted">
        {currentUrl ? (
          <Image
            src={currentUrl}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1024px) 360px, 100vw"
            className="object-cover"
          />
        ) : (
          <ImageIcon className="text-muted-foreground" />
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        <UploadIcon data-icon="inline-start" />
        {isUploading ? "Enviando..." : "Enviar imagem"}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
