import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { getUploadDir } from "./db";

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function inferImageExtension(mime: string, fileName?: string): string {
  if (MIME_TO_EXT[mime]) return MIME_TO_EXT[mime];
  if (fileName?.includes(".")) {
    const ext = fileName.split(".").pop();
    if (ext && /^[a-z0-9]+$/i.test(ext)) return ext.toLowerCase();
  }
  return "jpg";
}

export async function saveCrmImages(
  prefix: string,
  files: Blob[]
): Promise<string[]> {
  if (files.length === 0) return [];
  await mkdir(getUploadDir(), { recursive: true });
  const paths: string[] = [];
  for (const file of files) {
    const mime = typeof file.type === "string" ? file.type : "";
    const name = file instanceof File ? file.name : undefined;
    const ext = inferImageExtension(mime, name);
    const baseName = `${prefix}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const absPath = path.join(getUploadDir(), baseName);
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(absPath, buf);
    paths.push(`/uploads/crm/${baseName}`);
  }
  return paths;
}

/** Read public upload path (/uploads/crm/...) for Claude vision API. */
export async function readImageAsClaudeBlock(
  imagePath: string
): Promise<{ media_type: string; data: string } | null> {
  if (!imagePath.startsWith("/uploads/crm/")) return null;
  const rel = imagePath.replace(/^\/uploads\/crm\//, "");
  const abs = path.join(getUploadDir(), rel);
  try {
    const buf = await readFile(abs);
    const ext = rel.split(".").pop()?.toLowerCase() ?? "jpg";
    const media_type =
      ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : ext === "gif"
            ? "image/gif"
            : "image/jpeg";
    return { media_type, data: buf.toString("base64") };
  } catch {
    return null;
  }
}
