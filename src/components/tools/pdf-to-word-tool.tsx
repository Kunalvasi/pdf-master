"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, LoaderCircle } from "lucide-react";
import { ToolShell } from "@/components/tools/tool-shell";
import { Dropzone } from "@/components/upload/dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { xhrUpload } from "@/lib/utils/xhr-upload";

export function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ id: string; outputName: string } | null>(null);

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
      const res = await xhrUpload({ url: "/api/tools/pdf-to-word", formData: body, onProgress: setProgress });
      setResult({ id: res.fileId, outputName: res.outputName });
      toast.success("Conversion completed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Conversion failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell title="PDF to Word" description="Convert PDFs into editable DOCX files with private download links.">
      <Dropzone onFiles={(files) => setFile(files[0] ?? null)} />
      {file ? <Badge className="max-w-full truncate">{file.name}</Badge> : null}
      {busy ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="h-4 w-4 animate-spin" /> Converting document...
          </div>
          <Progress value={progress} />
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button onClick={submit} disabled={!file || busy}>Convert to DOCX</Button>
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
