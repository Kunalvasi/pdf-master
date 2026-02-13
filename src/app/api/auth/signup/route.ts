import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user";
import { signAuthToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  await connectDb();
  const exists = await User.findOne({ email: parsed.data.email.toLowerCase() });
  if (exists) return NextResponse.json({ error: "Email already exists" }, { status: 409 });

  const hash = await bcrypt.hash(parsed.data.password, 12);
  const user = await User.create({ email: parsed.data.email.toLowerCase(), passwordHash: hash });

  const token = await signAuthToken({ userId: user._id.toString(), email: user.email });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return res;
}
