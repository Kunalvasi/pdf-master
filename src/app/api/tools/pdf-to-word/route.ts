import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { connectDb } from "@/lib/db/mongoose";
import { FileRecord } from "@/lib/db/models/file-record";
import { getUserFromRequest, getMaxUploadBytes, tooLarge, unauthorized } from "@/lib/auth/request";
import { convertPdfToDocx } from "@/lib/pdf/convert";
import { uploadPrivateFile } from "@/lib/storage/cloudinary";
import { rateLimit } from "@/lib/rate-limit/memory";

function clientKey(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();

  const rl = rateLimit(`${user.userId}:${clientKey(request)}:convert`, 10, 60_000);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "PDF is required" }, { status: 400 });
  if (file.type !== "application/pdf") return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });

  const maxSize = getMaxUploadBytes();
  if (file.size > maxSize) return tooLarge();

  const pdf = Buffer.from(await file.arrayBuffer());
  const converted = await convertPdfToDocx(pdf, file.name);

  const uploaded = await uploadPrivateFile({
    buffer: converted.buffer,
    filename: `${randomUUID()}.docx`,
    folder: `pdfmaster/${user.userId}/pdf-to-word`
  });

  await connectDb();
  const record = await FileRecord.create({
    userId: user.userId,
    tool: "pdf-to-word",
    originalName: file.name,
    outputName: converted.filename,
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    originalSize: file.size,
    outputSize: uploaded.bytes,
    cloudinaryPublicId: uploaded.public_id,
    cloudinaryVersion: String(uploaded.version)
  });

  return NextResponse.json({ ok: true, fileId: record._id.toString(), outputName: converted.filename });
}
