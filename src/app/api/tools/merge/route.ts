import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { connectDb } from "@/lib/db/mongoose";
import { FileRecord } from "@/lib/db/models/file-record";
import { getUserFromRequest, getMaxUploadBytes, tooLarge, unauthorized } from "@/lib/auth/request";
import { mergePdfBuffers } from "@/lib/pdf/processor";
import { uploadPrivateFile } from "@/lib/storage/cloudinary";
import { rateLimit } from "@/lib/rate-limit/memory";

function clientKey(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();

  const rl = rateLimit(`${user.userId}:${clientKey(request)}:merge`, 20, 60_000);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const formData = await request.formData();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length < 2) return NextResponse.json({ error: "At least 2 PDFs are required" }, { status: 400 });

  const maxSize = getMaxUploadBytes();
  if (files.some((f) => f.size > maxSize)) return tooLarge();
  if (files.some((f) => f.type !== "application/pdf")) {
    return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
  }

  const buffers = await Promise.all(files.map(async (f) => Buffer.from(await f.arrayBuffer())));
  const merged = await mergePdfBuffers(buffers);

  const outputName = `merged-${Date.now()}.pdf`;
  const uploaded = await uploadPrivateFile({
    buffer: merged,
    filename: `${randomUUID()}.pdf`,
    folder: `pdfmaster/${user.userId}/merge`
  });

  await connectDb();
  const record = await FileRecord.create({
    userId: user.userId,
    tool: "merge",
    originalName: files.map((f) => f.name).join(", "),
    outputName,
    contentType: "application/pdf",
    originalSize: files.reduce((acc, f) => acc + f.size, 0),
    outputSize: uploaded.bytes,
    cloudinaryPublicId: uploaded.public_id,
    cloudinaryVersion: String(uploaded.version)
  });

  return NextResponse.json({ ok: true, fileId: record._id.toString(), outputName });
}
