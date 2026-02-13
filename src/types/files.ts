export type ToolKind = "merge" | "compress" | "pdf-to-word";

export type FileHistoryItem = {
  id: string;
  tool: ToolKind;
  outputName: string;
  originalName: string;
  originalSize: number;
  outputSize: number;
  createdAt: string;
  expiresAt: string;
};
