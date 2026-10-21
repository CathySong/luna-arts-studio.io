import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.log("Skipping Saturday class restore: Supabase build credentials are unavailable.");
  process.exit(0);
}

const db = createClient(url, key, { auth: { persistSession: false } });
const match = await db
  .from("website_classes")
  .select("id")
  .eq("day", "Saturday")
  .eq("title", "Mixed Media")
  .eq("start_time", "2:30 PM")
  .eq("end_time", "4:00 PM")
  .maybeSingle();

if (match.error) throw match.error;

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

const result = match.data
  ? await db.from("website_classes").update(values).eq("id", match.data.id)
  : await db.from("website_classes").insert(values);

if (result.error) throw result.error;
console.log("Saturday Mixed Media class is active in Supabase.");
