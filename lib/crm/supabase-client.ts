import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const CRM_STORAGE_BUCKET = "crm-artworks";

let adminClient: SupabaseClient | null = null;

function cleanEnv(value: string | undefined): string {
  if (!value) return "";
  // Strip inline comments (e.g. KEY=eyJ... # note) so dotenv mistakes do not break JWTs
  return value.split("#")[0]?.trim() ?? "";
}

export function isSupabaseConfigured(): boolean {
  return !!(
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

/** Server-only admin client (bypasses RLS). Never expose service role to the browser. */
export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);

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
