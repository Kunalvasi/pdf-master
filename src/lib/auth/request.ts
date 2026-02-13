import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

export async function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function tooLarge() {
  return NextResponse.json({ error: "File exceeds allowed size." }, { status: 413 });
}

export function getMaxUploadBytes() {
  const mb = Number(process.env.MAX_UPLOAD_MB || 25);
  return mb * 1024 * 1024;
}
