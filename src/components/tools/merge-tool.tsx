"use client";

import { useMemo, useState } from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { Download, GripVertical, X } from "lucide-react";
import { ToolShell } from "@/components/tools/tool-shell";
import { Dropzone } from "@/components/upload/dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils";
import { xhrUpload } from "@/lib/utils/xhr-upload";

type Item = { id: string; file: File };

function SortableRow({ item, onRemove }: { item: Item; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li ref={setNodeRef} style={style} className="flex w-full items-center justify-between gap-2 overflow-hidden rounded-lg border border-border bg-background/60 px-3 py-2">
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
        <button className="shrink-0 text-muted-foreground" {...attributes} {...listeners}><GripVertical className="h-4 w-4" /></button>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{item.file.name}</p>
          <p className="text-xs text-muted-foreground">{formatBytes(item.file.size)}</p>
        </div>
      </div>
      <button onClick={() => onRemove(item.id)} className="shrink-0 text-muted-foreground hover:text-red-500"><X className="h-4 w-4" /></button>
    </li>
  );
}

export function MergeTool() {
  const [items, setItems] = useState<Item[]>([]);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [download, setDownload] = useState<{ id: string; name: string } | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));
  const totalSize = useMemo(() => items.reduce((a, i) => a + i.file.size, 0), [items]);

  const addFiles = (files: File[]) => {
    const pdfs = files.filter((f) => f.type === "application/pdf");
    if (!pdfs.length) {
      toast.error("Only PDF files are allowed");
      return;
    }
    setItems((prev) => [...prev, ...pdfs.map((file) => ({ id: crypto.randomUUID(), file }))]);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const submit = async () => {
    if (items.length < 2) {
      toast.error("Add at least 2 files");
      return;
    }

    setBusy(true);
    setProgress(0);
    setDownload(null);

    try {
      const body = new FormData();
      items.forEach((item) => body.append("files", item.file));
      const res = await xhrUpload({ url: "/api/tools/merge", formData: body, onProgress: setProgress });
      setDownload({ id: res.fileId, name: res.outputName });
      toast.success("Merge completed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Merge failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell title="Merge PDFs" description="Upload multiple PDFs, reorder with drag-and-drop, and download one merged file.">
      <Dropzone multiple onFiles={addFiles} />
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>{items.length} files selected</span>
        <Badge className="max-w-full">{formatBytes(totalSize)}</Badge>
      </div>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <ul className="max-h-[42vh] space-y-2 overflow-y-auto pr-1">
            {items.map((item) => <SortableRow key={item.id} item={item} onRemove={(id) => setItems((prev) => prev.filter((i) => i.id !== id))} />)}
          </ul>
        </SortableContext>
      </DndContext>
      {busy ? <Progress value={progress} /> : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button className="w-full sm:w-auto" onClick={submit} disabled={busy || items.length < 2}>Merge Files</Button>
        {download ? (
          <Button className="w-full sm:w-auto" variant="secondary" asChild>
            <a href={`/api/files/${download.id}/download`} target="_blank" rel="noreferrer">
              <Download className="mr-2 h-4 w-4" /> Download
            </a>
          </Button>
        ) : null}
      </div>
    </ToolShell>
  );
}
