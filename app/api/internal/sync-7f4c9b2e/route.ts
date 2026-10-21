import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/crm/supabase-client";
import { listWebsiteClasses } from "@/lib/crm/website-classes";

export async function POST() {
  const db = getSupabaseAdmin();
  const existing = await db
    .from("website_classes")
    .select("id")
    .eq("day", "Saturday")
    .eq("title", "Mixed Media")
    .eq("start_time", "2:30 PM")
    .eq("end_time", "4:00 PM")
    .maybeSingle();

  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }

  const values = {
    day: "Saturday",
    day_short: "Sat",
    title: "Mixed Media",
    ages: "Ages 8+",
    start_time: "2:30 PM",
    end_time: "4:00 PM",
    duration_minutes: 90,
    active: true,
    sort_order: 60,
    updated_at: new Date().toISOString(),
  };

  const result = existing.data
    ? await db.from("website_classes").update(values).eq("id", existing.data.id).select("*").single()
    : await db.from("website_classes").insert(values).select("*").single();

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }
  const raw = await db.from("website_classes").select("*").order("sort_order");
  const publicClasses = await listWebsiteClasses();
  return NextResponse.json({ ok: true, class: result.data, raw: raw.data, rawError: raw.error?.message, publicClasses });
}
