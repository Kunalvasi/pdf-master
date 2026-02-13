"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" className="w-full" disabled={pending}>{pending ? "Please wait..." : label}</Button>;
}

export function AuthForm({
  action,
  submitLabel
}: {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm">Email</label>
        <Input type="email" name="email" required />
      </div>
      <div>
        <label className="mb-1 block text-sm">Password</label>
        <Input type="password" name="password" minLength={8} required />
      </div>
      <SubmitButton label={submitLabel} />
    </form>
  );
}
