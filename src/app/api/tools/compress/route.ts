import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { connectDb } from "@/lib/db/mongoose";
import { FileRecord } from "@/lib/db/models/file-record";
import { getUserFromRequest, getMaxUploadBytes, tooLarge, unauthorized } from "@/lib/auth/request";
import { compressPdfBuffer } from "@/lib/pdf/processor";
import { uploadPrivateFile } from "@/lib/storage/cloudinary";
import { rateLimit } from "@/lib/rate-limit/memory";

function clientKey(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorized();

    const rl = rateLimit(`${user.userId}:${clientKey(request)}:compress`, 20, 60_000);
    if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "PDF is required" }, { status: 400 });

    const looksLikePdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!looksLikePdf) return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });

    const maxSize = getMaxUploadBytes();
    if (file.size > maxSize) return tooLarge();

    const original = Buffer.from(await file.arrayBuffer());
    const compressed = await compressPdfBuffer(original);
    const outputBuffer = compressed.length < original.length ? compressed : original;
    const wasCompressed = compressed.length < original.length;
    const outputName = `${file.name.replace(/\.pdf$/i, "")}-compressed.pdf`;

    const uploaded = await uploadPrivateFile({
      buffer: outputBuffer,
      filename: `${randomUUID()}.pdf`,
      folder: `pdfmaster/${user.userId}/compress`
    });

    await connectDb();
    const record = await FileRecord.create({
      userId: user.userId,
      tool: "compress",
      originalName: file.name,
      outputName,
      contentType: "application/pdf",
      originalSize: file.size,
      outputSize: outputBuffer.length,
      cloudinaryPublicId: uploaded.public_id,
      cloudinaryVersion: String(uploaded.version)
    });

    return NextResponse.json({
      ok: true,
      fileId: record._id.toString(),
      outputName,
      originalSize: file.size,
      outputSize: outputBuffer.length,
      wasCompressed
    });
  } catch (error) {
    console.error("Compress API failed:", error);
    return NextResponse.json({ error: "Compression failed. Check file validity and storage configuration." }, { status: 500 });
  }
}
