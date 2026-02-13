"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user";
import { signAuthToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

async function issueCookie(userId: string, email: string) {
  const token = await signAuthToken({ userId, email });
  cookies().set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function signupAction(formData: FormData): Promise<void> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) redirect("/signup?error=invalid");

  await connectDb();
  const exists = await User.findOne({ email: parsed.data.email.toLowerCase() });
  if (exists) redirect("/signup?error=exists");

  const user = await User.create({
    email: parsed.data.email.toLowerCase(),
    passwordHash: await bcrypt.hash(parsed.data.password, 12)
  });

  await issueCookie(user._id.toString(), user.email);
  redirect("/dashboard");
}

export async function loginAction(formData: FormData): Promise<void> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) redirect("/login?error=invalid");

  await connectDb();
  const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
  if (!user) redirect("/login?error=invalid");

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) redirect("/login?error=invalid");

  await issueCookie(user._id.toString(), user.email);
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  cookies().set(AUTH_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  redirect("/");
}
