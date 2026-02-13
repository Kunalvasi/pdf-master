import { logoutAction } from "@/app/(auth)/actions";
import { requireUser } from "@/lib/auth/session";
import { FileHistory } from "@/components/dashboard/file-history";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <div className="glass flex flex-col items-start justify-between gap-3 rounded-2xl p-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
        </div>
        <form action={logoutAction}>
          <Button variant="outline">Log out</Button>
        </form>
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Your Files</h2>
        <FileHistory />
      </section>
    </div>
  );
}
