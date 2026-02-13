import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { FileRecord } from "@/lib/db/models/file-record";
import { getPrivateDownloadUrl } from "@/lib/storage/cloudinary";

type Params = { params: { id: string } };

type FileDoc = {
  outputName: string;
  contentType: string;
  cloudinaryPublicId: string;
  cloudinaryVersion: string;
};

export async function GET(_request: NextRequest, { params }: Params) {
  await connectDb();
  const file = await FileRecord.findById(params.id).lean<FileDoc | null>();
  if (!file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const extension = file.outputName.split(".").pop()?.toLowerCase() || "";
  const url = getPrivateDownloadUrl(file.cloudinaryPublicId, extension);
  const upstream = await fetch(url, { cache: "no-store" });

  if (!upstream.ok) {
    return NextResponse.json({ error: "Failed to fetch file from storage" }, { status: 502 });
  }

  const data = await upstream.arrayBuffer();
  const safeFilename = file.outputName.replace(/"/g, "");

  return new NextResponse(data, {
    status: 200,
    headers: {
      "Content-Type": file.contentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename=\"${safeFilename}\"`,
      "Cache-Control": "no-store"
    }
  });
}
