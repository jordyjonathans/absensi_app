import { genSalt } from "bcrypt";
import { randomBytes } from "crypto";
import path from "path";
import fs from "fs";

export const getRandomSalt = async (size: number) => {
  return await genSalt(size);
};

export const toYMD = (d: string | Date) =>
  (typeof d === "string" ? new Date(d) : d).toISOString().slice(0, 10); // 'YYYY-MM-DD'

export const UPLOAD_FOLDER_PATH = path.join(process.cwd(), "src/uploads");

export const imageToBase64 = (imagePath: string): string => {
  const fileBuffer = fs.readFileSync(imagePath);
  const mimeType = getMimeType(imagePath); // e.g., "image/png"
  const base64 = fileBuffer.toString("base64");
  return `data:${mimeType};base64,${base64}`;
};

/**
 * Get MIME type based on file extension
 */
export const getMimeType = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
};
