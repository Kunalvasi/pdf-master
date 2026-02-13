"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { ToolShell } from "@/components/tools/tool-shell";
import { Dropzone } from "@/components/upload/dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils";
import { xhrUpload } from "@/lib/utils/xhr-upload";

export function CompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ id: string; originalSize: number; outputSize: number; wasCompressed: boolean } | null>(null);

  const submit = async () => {
    if (!file) {
      toast.error("Select a PDF file first");
      return;
    }

    setBusy(true);
    setResult(null);

    try {
      const body = new FormData();
      body.append("file", file);
      const res = await xhrUpload({ url: "/api/tools/compress", formData: body, onProgress: setProgress });
      setResult({ id: res.fileId, originalSize: res.originalSize, outputSize: res.outputSize, wasCompressed: Boolean(res.wasCompressed) });
      toast.success(res.wasCompressed ? "Compression completed" : "File already optimized. Kept smallest version.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Compression failed");
    } finally {
      setBusy(false);
    }
  };

  const reduction = result
    ? Math.max(0, Math.round(((result.originalSize - result.outputSize) / Math.max(1, result.originalSize)) * 100))
    : 0;

  return (
    <ToolShell title="Compress PDF" description="Upload a PDF, reduce file size, and compare before/after output.">
      <Dropzone onFiles={(files) => setFile(files[0] ?? null)} />
      {file ? <Badge className="max-w-full truncate">{file.name} ({formatBytes(file.size)})</Badge> : null}
      {busy ? <Progress value={progress} /> : null}
      {result ? (
        <div className="rounded-lg border border-border bg-background/60 p-3 text-sm">
          <p>Before: {formatBytes(result.originalSize)}</p>
          <p>After: {formatBytes(result.outputSize)}</p>
          <p>Saved: {reduction}%</p>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button onClick={submit} disabled={!file || busy}>Compress</Button>
        {result ? (
          <Button variant="secondary" asChild>
            <a href={`/api/files/${result.id}/download`} target="_blank" rel="noreferrer">
              <Download className="mr-2 h-4 w-4" /> Download
            </a>
          </Button>
        ) : null}
      </div>
    </ToolShell>
  );
}
