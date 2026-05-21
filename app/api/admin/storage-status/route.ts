import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import { getCrmStorageBackend } from "@/lib/crm/db";
import { getSupabaseConfigStatus } from "@/lib/crm/supabase-env";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const supabase = getSupabaseConfigStatus();

  let backend: string;
  try {
    backend = getCrmStorageBackend();
  } catch (e) {
    backend = e instanceof Error ? e.message : "error";
  }

  return NextResponse.json({
    backend,
    supabase,
    vercel: !!process.env.VERCEL,
    nodeEnv: process.env.NODE_ENV,
  });
}
