/** Resolve Supabase env vars (supports Vercel / Supabase integration naming). */

export function cleanEnv(value: string | undefined): string {
  if (!value) return "";
  return value.split("#")[0]?.trim() ?? "";
}

export function getSupabaseUrl(): string {
  return cleanEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
      process.env.SUPABASE_URL ??
      process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL
  );
}

/** Service role only — required for CRM writes. Not the publishable/anon key. */
export function getSupabaseServiceRoleKey(): string {
  return cleanEnv(
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.SUPABASE_SECRET_KEY ??
      process.env.SUPABASE_SERVICE_KEY
  );
}

export type SupabaseConfigStatus = {
  ok: boolean;
  url: boolean;
  serviceRole: boolean;
  crmStorage: string | null;
  missing: string[];
};

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const url = !!getSupabaseUrl();
  const serviceRole = !!getSupabaseServiceRoleKey();
  const crmStorage = process.env.CRM_STORAGE?.trim() || null;
  const missing: string[] = [];
  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceRole) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  return {
    ok: url && serviceRole,
    url,
    serviceRole,
    crmStorage,
    missing,
  };
}

export function formatSupabaseConfigError(): string {
  const s = getSupabaseConfigStatus();
  const lines = [
    "Supabase CRM is not fully configured on this deployment.",
    "",
    "In Vercel → Project → Settings → Environment Variables (Production), add:",
    "",
    "  CRM_STORAGE = supabase",
    "  NEXT_PUBLIC_SUPABASE_URL = https://YOUR_PROJECT.supabase.co",
    "  SUPABASE_SERVICE_ROLE_KEY = (from Supabase → Settings → API → service_role secret)",
    "",
    "Important: Vercel's Supabase integration does NOT add the service_role key automatically.",
    "Do not use the publishable/anon key for CRM_STORAGE writes.",
    "",
    `Currently detected: URL=${s.url ? "yes" : "MISSING"}, service_role=${s.serviceRole ? "yes" : "MISSING"}, CRM_STORAGE=${s.crmStorage ?? "(not set)"}`,
  ];
  return lines.join("\n");
}
