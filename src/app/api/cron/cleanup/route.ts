import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { FileRecord } from "@/lib/db/models/file-record";
import { deletePrivateFile } from "@/lib/storage/cloudinary";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDb();
  const now = new Date();
  const expired = await FileRecord.find({ expiresAt: { $lte: now } }).lean();

  await Promise.all(
    expired.map(async (f) => {
      await deletePrivateFile(f.cloudinaryPublicId);
      await FileRecord.deleteOne({ _id: f._id });
    })
  );

  return NextResponse.json({ ok: true, cleaned: expired.length });
}
