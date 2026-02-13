import { PDFDocument } from "pdf-lib";

export async function mergePdfBuffers(files: Buffer[]) {
  const merged = await PDFDocument.create();

  for (const file of files) {
    const doc = await PDFDocument.load(file);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }

  return Buffer.from(await merged.save({ useObjectStreams: true }));
}

export async function compressPdfBuffer(file: Buffer) {
  const doc = await PDFDocument.load(file);
  doc.setTitle("");
  doc.setSubject("");
  doc.setProducer("PDFMaster");
  doc.setCreator("PDFMaster");

  // pdf-lib compression is lightweight and may not reduce all PDFs significantly.
  return Buffer.from(await doc.save({ useObjectStreams: true, addDefaultPage: false }));
}
