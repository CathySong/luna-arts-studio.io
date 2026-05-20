import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { getUploadDir } from "./db";
import {
  CRM_STORAGE_BUCKET,
  getSupabaseAdmin,
  shouldUseSupabaseStorage,
} from "./supabase-client";

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

async function saveCrmImagesLocal(prefix: string, files: Blob[]): Promise<string[]> {
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

async function saveCrmImagesSupabase(prefix: string, files: Blob[]): Promise<string[]> {
  if (files.length === 0) return [];
  const sb = getSupabaseAdmin();
  const urls: string[] = [];

  for (const file of files) {
    const mime = typeof file.type === "string" ? file.type : "image/jpeg";
    const name = file instanceof File ? file.name : undefined;
    const ext = inferImageExtension(mime, name);
    const objectPath = `${prefix}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());

    const { error } = await sb.storage.from(CRM_STORAGE_BUCKET).upload(objectPath, buf, {
      contentType: mime,
      upsert: false,
    });
    if (error) {
      throw new Error(
        `Supabase Storage upload failed: ${error.message}. Create a public bucket "${CRM_STORAGE_BUCKET}" — see docs/supabase-setup.md`
      );
    }

    const { data } = sb.storage.from(CRM_STORAGE_BUCKET).getPublicUrl(objectPath);
    urls.push(data.publicUrl);
  }
  return urls;
}

export async function saveCrmImages(prefix: string, files: Blob[]): Promise<string[]> {
  if (shouldUseSupabaseStorage()) return saveCrmImagesSupabase(prefix, files);
  return saveCrmImagesLocal(prefix, files);
}

/** Load image for Claude vision (local path or Supabase public URL). */
export async function readImageAsClaudeBlock(
  imagePath: string
): Promise<{ media_type: string; data: string } | null> {
  try {
    let buf: Buffer;
    let ext = "jpg";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      const res = await fetch(imagePath);
      if (!res.ok) return null;
      buf = Buffer.from(await res.arrayBuffer());
      const urlExt = imagePath.split(".").pop()?.split("?")[0]?.toLowerCase();
      if (urlExt && ["jpg", "jpeg", "png", "webp", "gif"].includes(urlExt)) {
        ext = urlExt === "jpeg" ? "jpg" : urlExt;
      }
    } else if (imagePath.startsWith("/uploads/crm/")) {
      const rel = imagePath.replace(/^\/uploads\/crm\//, "");
      const abs = path.join(getUploadDir(), rel);
      buf = await readFile(abs);
      ext = rel.split(".").pop()?.toLowerCase() ?? "jpg";
    } else {
      return null;
    }

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
