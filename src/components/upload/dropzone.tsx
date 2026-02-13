"use client";

import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  multiple?: boolean;
  accept?: string;
  onFiles: (files: File[]) => void;
  className?: string;
};

export function Dropzone({ multiple = false, accept = "application/pdf", onFiles, className }: Props) {
  function handleFileList(list: FileList | null) {
    if (!list) return;
    onFiles(Array.from(list));
  }

  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/60 p-8 text-center transition hover:border-primary",
        className
      )}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFileList(e.dataTransfer.files);
      }}
    >
      <UploadCloud className="mb-3 h-10 w-10 text-primary" />
      <p className="font-medium">Drag and drop PDF files here</p>
      <p className="text-sm text-muted-foreground">or click to browse</p>
      <input
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileList(e.target.files)}
      />
    </label>
  );
}
