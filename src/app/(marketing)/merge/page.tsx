import { requireUser } from "@/lib/auth/session";
import { MergeTool } from "@/components/tools/merge-tool";

export default async function MergePage() {
  await requireUser();
  return <MergeTool />;
}
