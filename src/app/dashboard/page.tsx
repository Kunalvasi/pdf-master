import { FileHistory } from "@/components/dashboard/file-history";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-5">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Recent processed files.</p>
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold">File History</h2>
        <FileHistory />
      </section>
    </div>
  );
}
