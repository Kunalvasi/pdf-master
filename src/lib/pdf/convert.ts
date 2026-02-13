export async function convertPdfToDocx(pdf: Buffer, filename: string) {
  const secret = process.env.CONVERTAPI_SECRET;
  if (!secret) {
    throw new Error("CONVERTAPI_SECRET is not configured");
  }

  const body = new FormData();
  body.append("File", new Blob([new Uint8Array(pdf)], { type: "application/pdf" }), filename);

  const res = await fetch(`https://v2.convertapi.com/convert/pdf/to/docx?Secret=${secret}`, {
    method: "POST",
    body
  });

  if (!res.ok) {
    throw new Error("Conversion provider failed");
  }

  const data = (await res.json()) as {
    Files?: Array<{ Url: string; FileName: string }>;
  };

  const output = data.Files?.[0];
  if (!output?.Url) {
    throw new Error("Conversion response missing output file");
  }

  const outRes = await fetch(output.Url);
  if (!outRes.ok) {
    throw new Error("Failed to download converted document");
  }

  const arrayBuffer = await outRes.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    filename: output.FileName || filename.replace(/\.pdf$/i, ".docx")
  };
}

