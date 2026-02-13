import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function uploadPrivateFile(params: {
  buffer: Buffer;
  filename: string;
  folder: string;
  resourceType?: "raw" | "image" | "video";
}) {
  return new Promise<{ public_id: string; version: number; bytes: number }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: params.folder,
        public_id: params.filename,
        resource_type: params.resourceType ?? "raw",
        type: "private",
        overwrite: true
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ public_id: result.public_id, version: result.version, bytes: result.bytes });
      }
    );
    stream.end(params.buffer);
  });
}

export function getPrivateDownloadUrl(publicId: string, format = "") {
  return cloudinary.utils.private_download_url(publicId, format, {
    resource_type: "raw",
    type: "private",
    expires_at: Math.floor(Date.now() / 1000) + 60,
    attachment: true
  });
}

export async function deletePrivateFile(publicId: string) {
  await cloudinary.uploader.destroy(publicId, { resource_type: "raw", type: "private" });
}
