import { NextResponse } from "next/server";
import { listWebsiteClasses } from "@/lib/crm/website-classes";

export const dynamic = "force-dynamic";

export async function GET() {
  const classes = await listWebsiteClasses();
  return NextResponse.json({ classes }, { headers: { "Cache-Control": "no-store" } });
}
