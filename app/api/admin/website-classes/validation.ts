import type { WebsiteClass } from "@/lib/crm/website-classes";

const DAY_SHORT: Record<string, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu",
  Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};

export function coerceWebsiteClass(body: Record<string, unknown>): Omit<WebsiteClass, "id"> {
  const required = (key: string) => {
    const value = typeof body[key] === "string" ? body[key].trim() : "";
    if (!value) throw new Error(`${key} is required`);
    return value;
  };
  const day = required("day");
  if (!DAY_SHORT[day]) throw new Error("day is invalid");
  return {
    day,
    dayShort: DAY_SHORT[day],
    title: required("title"),
    ages: typeof body.ages === "string" ? body.ages.trim() || undefined : undefined,
    startTime: required("startTime"),
    endTime: required("endTime"),
    durationMinutes: Number(body.durationMinutes) || 90,
    active: body.active !== false,
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
  };
}
