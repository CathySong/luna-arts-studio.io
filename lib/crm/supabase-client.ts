import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const CRM_STORAGE_BUCKET = "crm-artworks";

let adminClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

/** Server-only admin client (bypasses RLS). Never expose service role to the browser. */
export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. See docs/supabase-setup.md"
    );
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
