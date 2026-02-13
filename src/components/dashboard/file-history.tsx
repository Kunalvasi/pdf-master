"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { FileHistoryItem } from "@/types/files";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";

export function FileHistory() {
  const [items, setItems] = useState<FileHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/files/history")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-muted-foreground">Loading files...</p>;
  if (!items.length) return <p className="text-sm text-muted-foreground">No files yet.</p>;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="glass flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{item.outputName}</p>
              <Badge>{item.tool}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">From: {item.originalName}</p>
            <p className="text-sm text-muted-foreground">
              {formatBytes(item.originalSize)} to {formatBytes(item.outputSize)}
            </p>
          </div>
          <Button asChild variant="secondary">
            <a href={`/api/files/${item.id}/download`} target="_blank" rel="noreferrer">
              <Download className="mr-2 h-4 w-4" /> Download
            </a>
          </Button>
        </Card>
      ))}
    </div>
  );
}
