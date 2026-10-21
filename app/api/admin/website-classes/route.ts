import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/crm/api-auth";
import { createWebsiteClass, listWebsiteClasses } from "@/lib/crm/website-classes";
import { coerceWebsiteClass } from "./validation";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  return NextResponse.json({ classes: await listWebsiteClasses(true) });
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const item = await createWebsiteClass(coerceWebsiteClass(body));
    return NextResponse.json({ class: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create class" }, { status: 400 });
  }
}
