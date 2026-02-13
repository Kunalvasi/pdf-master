import { requireUser } from "@/lib/auth/session";
import { CompressTool } from "@/components/tools/compress-tool";

export default async function CompressPage() {
  await requireUser();
  return <CompressTool />;
}
