import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { AuthForm } from "@/components/auth-form";
import { signupAction } from "@/app/(auth)/actions";

function errorMessage(error?: string) {
  if (error === "exists") return "Email already registered.";
  if (error === "invalid") return "Provide a valid email and password (min 8 chars).";
  return null;
}

export default function SignupPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <div className="mx-auto max-w-md">
      <Card className="glass">
        <CardTitle>Create your account</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">Get secure PDF workflows and 24-hour private storage.</p>
        <div className="mt-6">
          <AuthForm action={signupAction} submitLabel="Sign up" />
        </div>
        {errorMessage(searchParams?.error) ? <p className="mt-3 text-sm text-red-500">{errorMessage(searchParams?.error)}</p> : null}
        <p className="mt-4 text-sm text-muted-foreground">Already have an account? <Link href="/login" className="text-primary">Log in</Link></p>
      </Card>
    </div>
  );
}
