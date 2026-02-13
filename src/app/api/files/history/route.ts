import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { FileRecord } from "@/lib/db/models/file-record";
import { getUserFromRequest, unauthorized } from "@/lib/auth/request";

type HistoryDoc = {
  _id: string;
  tool: "merge" | "compress" | "pdf-to-word";
  outputName: string;
  originalName: string;
  originalSize: number;
  outputSize: number;
  createdAt: string;
  expiresAt: string;
};

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();

  await connectDb();
  const files = await FileRecord.find({ userId: user.userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean<HistoryDoc[]>();

  return NextResponse.json({
    items: files.map((f) => ({
      id: String(f._id),
      tool: f.tool,
      outputName: f.outputName,
      originalName: f.originalName,
      originalSize: f.originalSize,
      outputSize: f.outputSize,
      createdAt: f.createdAt,
      expiresAt: f.expiresAt
    }))
  });
}
