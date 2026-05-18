import { NextResponse } from "next/server";

import { clearAuthSession, setAuthSession, verifyPassword } from "@/lib/crm/auth";

export async function POST(req: Request) {
  if (!verifyPassword(await readPassword(req))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  await setAuthSession(res);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearAuthSession(res);
  return res;
}

async function readPassword(req: Request): Promise<string> {
  const contentType = req.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      const body = (await req.json()) as { password?: string };
      return typeof body.password === "string" ? body.password : "";
    }
    const fd = await req.formData();
    const v = fd.get("password") ?? fd.get("ADMIN_PASSWORD");
    return typeof v === "string" ? v : "";
  } catch {
    return "";
  }
}
