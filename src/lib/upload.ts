import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname } from "node:path";
import { randomUUID } from "node:crypto";

import {
  ALLOWED_PHOTO_MIME,
  MAX_PHOTO_BYTES,
} from "./validation";

const UPLOADS_DIR = join(process.cwd(), "uploads");

export class UploadError extends Error {
  constructor(message: string, public statusCode = 400) {
    super(message);
  }
}

async function ensureDir() {
  if (!existsSync(UPLOADS_DIR)) {
    await mkdir(UPLOADS_DIR, { recursive: true });
  }
}

function detectMimeFromMagicBytes(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  // JPEG : FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  // PNG : 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  )
    return "image/png";
  // WebP : "RIFF....WEBP"
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  )
    return "image/webp";
  return null;
}

function extensionFor(mime: string): string {
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  return "";
}

export async function savePhoto(file: File): Promise<{
  filename: string;
  mimeType: string;
  sizeBytes: number;
}> {
  if (file.size > MAX_PHOTO_BYTES) {
    throw new UploadError("Photo trop volumineuse (max 5 Mo)", 400);
  }
  const declared = file.type;
  if (!ALLOWED_PHOTO_MIME.includes(declared as (typeof ALLOWED_PHOTO_MIME)[number])) {
    throw new UploadError("Format non supporté (JPEG, PNG ou WebP requis)", 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectMimeFromMagicBytes(buffer);
  if (!detected || detected !== declared) {
    throw new UploadError("Le contenu du fichier ne correspond pas au format déclaré", 400);
  }

  await ensureDir();
  const filename = `${randomUUID()}${extensionFor(detected)}`;
  await writeFile(join(UPLOADS_DIR, filename), buffer);

  return { filename, mimeType: detected, sizeBytes: buffer.length };
}

export async function readPhoto(filename: string): Promise<{
  buffer: Buffer;
  mimeType: string;
} | null> {
  // Sécurité : éviter le path traversal
  if (filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
    return null;
  }
  const filepath = join(UPLOADS_DIR, filename);
  if (!existsSync(filepath)) return null;
  const buffer = await readFile(filepath);
  const ext = extname(filename).toLowerCase();
  const mimeType =
    ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : ext === ".png"
        ? "image/png"
        : ext === ".webp"
          ? "image/webp"
          : "application/octet-stream";
  return { buffer, mimeType };
}

export async function uploadDirInfo() {
  await ensureDir();
  return { path: UPLOADS_DIR, exists: existsSync(UPLOADS_DIR) };
}
