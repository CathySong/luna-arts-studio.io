import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/crm/api-auth";
import { deleteWebsiteClass, updateWebsiteClass } from "@/lib/crm/website-classes";
import { coerceWebsiteClass } from "../validation";

type Context = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Context) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const item = await updateWebsiteClass(params.id, coerceWebsiteClass(await req.json()));
    return NextResponse.json({ class: item });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update class" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    await deleteWebsiteClass(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete class" }, { status: 400 });
  }
}
