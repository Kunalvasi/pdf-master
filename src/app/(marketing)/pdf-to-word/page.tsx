import { requireUser } from "@/lib/auth/session";
import { PdfToWordTool } from "@/components/tools/pdf-to-word-tool";

export default async function PdfToWordPage() {
  await requireUser();
  return <PdfToWordTool />;
}
