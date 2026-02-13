import { Schema, model, models } from "mongoose";

const fileSchema = new Schema(
  {
    userId: { type: String, required: false, index: true },
    tool: { type: String, enum: ["merge", "compress", "pdf-to-word"], required: true },
    originalName: { type: String, required: true },
    outputName: { type: String, required: true },
    contentType: { type: String, required: true },
    originalSize: { type: Number, required: true },
    outputSize: { type: Number, required: true },
    cloudinaryPublicId: { type: String, required: true },
    cloudinaryVersion: { type: String, required: true },
    expiresAt: { type: Date, required: true, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }
  },
  { timestamps: true }
);

fileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const FileRecord = models.FileRecord || model("FileRecord", fileSchema);

