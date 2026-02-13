import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { AuthForm } from "@/components/auth-form";
import { loginAction } from "@/app/(auth)/actions";

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <div className="mx-auto max-w-md">
      <Card className="glass">
        <CardTitle>Log in to PDFMaster</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">Access your private file history and tools.</p>
        <div className="mt-6">
          <AuthForm action={loginAction} submitLabel="Log in" />
        </div>
        {searchParams?.error ? <p className="mt-3 text-sm text-red-500">Invalid email or password.</p> : null}
        <p className="mt-4 text-sm text-muted-foreground">New here? <Link href="/signup" className="text-primary">Create account</Link></p>
      </Card>
    </div>
  );
}
