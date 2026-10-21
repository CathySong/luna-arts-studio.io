import { fallEnrollmentConfig, type WeeklyDaySchedule } from "@/config/fall-enrollment";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase-client";

export type WebsiteClass = {
  id: string;
  day: string;
  dayShort: string;
  title: string;
  ages?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  active: boolean;
  sortOrder: number;
};

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function fallbackClasses(): WebsiteClass[] {
  return fallEnrollmentConfig.weeklySchedule.flatMap((day, dayIndex) =>
    day.slots.map((slot, slotIndex) => {
      const [start = "", end = ""] = slot.time.replaceAll("–", "-").split("-");
      return {
        id: `fallback-${day.dayShort}-${slotIndex}`,
        day: day.day,
        dayShort: day.dayShort,
        title: slot.title,
        ages: slot.ages,
        startTime: start.trim(),
        endTime: end.trim(),
        durationMinutes: 90,
        active: true,
        sortOrder: dayIndex * 10 + slotIndex,
      };
    })
  );
}

function fromRow(row: Record<string, unknown>): WebsiteClass {
  return {
    id: String(row.id),
    day: String(row.day),
    dayShort: String(row.day_short),
    title: String(row.title),
    ages: row.ages ? String(row.ages) : undefined,
    startTime: String(row.start_time),
    endTime: String(row.end_time),
    durationMinutes: Number(row.duration_minutes ?? 90),
    active: row.active !== false,
    sortOrder: Number(row.sort_order ?? 0),
  };
}

function toRow(item: Omit<WebsiteClass, "id"> | Partial<WebsiteClass>) {
  return {
    day: item.day,
    day_short: item.dayShort,
    title: item.title,
    ages: item.ages || null,
    start_time: item.startTime,
    end_time: item.endTime,
    duration_minutes: item.durationMinutes,
    active: item.active,
    sort_order: item.sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export async function listWebsiteClasses(includeInactive = false): Promise<WebsiteClass[]> {
  if (!isSupabaseConfigured()) return fallbackClasses();
  const { data, error } = await getSupabaseAdmin().from("website_classes").select("*").order("sort_order");
  if (error) {
    // Keep the public website useful while a new migration is being applied.
    if (!includeInactive) return fallbackClasses();
    throw new Error(`listWebsiteClasses: ${error.message}`);
  }
  const classes = (data ?? []).map((row) => fromRow(row));
  return includeInactive ? classes : classes.filter((item) => item.active);
}

export async function createWebsiteClass(input: Omit<WebsiteClass, "id">) {
  const { data, error } = await getSupabaseAdmin().from("website_classes").insert(toRow(input)).select("*").single();
  if (error) throw new Error(error.message);
  return fromRow(data);
}

export async function updateWebsiteClass(id: string, patch: Partial<WebsiteClass>) {
  const { data, error } = await getSupabaseAdmin().from("website_classes").update(toRow(patch)).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return fromRow(data);
}

export async function deleteWebsiteClass(id: string) {
  const { error } = await getSupabaseAdmin().from("website_classes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export function classesToWeeklySchedule(classes: WebsiteClass[]): WeeklyDaySchedule[] {
  const grouped = new Map<string, WeeklyDaySchedule>();
  for (const item of classes.filter((item) => item.active)) {
    const day = grouped.get(item.day) ?? { day: item.day, dayShort: item.dayShort, slots: [] };
    day.slots.push({
      time: `${item.startTime}–${item.endTime}`,
      title: item.title,
      ages: item.ages,
      duration: `${item.durationMinutes} min`,
    });
    grouped.set(item.day, day);
  }
  return Array.from(grouped.values()).sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));
}
