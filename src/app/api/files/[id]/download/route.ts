import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { FileRecord } from "@/lib/db/models/file-record";
import { getUserFromRequest, unauthorized } from "@/lib/auth/request";
import { getPrivateDownloadUrl } from "@/lib/storage/cloudinary";

type Params = { params: { id: string } };

type FileDoc = {
  userId: string;
  outputName: string;
  contentType: string;
  cloudinaryPublicId: string;
  cloudinaryVersion: string;
};

export async function GET(request: NextRequest, { params }: Params) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();

  await connectDb();
  const file = await FileRecord.findById(params.id).lean<FileDoc | null>();
  if (!file || String(file.userId) !== user.userId) {
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

