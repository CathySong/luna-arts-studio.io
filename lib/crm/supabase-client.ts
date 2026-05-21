import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import {
  formatSupabaseConfigError,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "./supabase-env";

export const CRM_STORAGE_BUCKET = "crm-artworks";

let adminClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return !!(getSupabaseUrl() && getSupabaseServiceRoleKey());
}

/** Server-only admin client (bypasses RLS). Never expose service role to the browser. */
export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = getSupabaseUrl();
  const key = getSupabaseServiceRoleKey();

  if (!url || !key) {
    throw new Error(formatSupabaseConfigError());
  }

  adminClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return adminClient;
}

export function shouldUseSupabaseStorage(): boolean {
  const mode = process.env.CRM_STORAGE?.trim().toLowerCase();
  if (mode === "json") return false;
  if (mode === "supabase") return isSupabaseConfigured();
  return isSupabaseConfigured() && !!process.env.VERCEL;
}
