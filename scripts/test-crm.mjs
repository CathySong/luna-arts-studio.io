#!/usr/bin/env node
/**
 * CRM smoke test: auth, session, Claude review generation.
 */
import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const BASE = process.argv[2] ?? "http://localhost:3000";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "luna-admin-dev";
const jar = new Map();
let failed = false;

function log(ok, step, msg) {
  console.log(`${ok ? "✓" : "✗"} [${step}] ${msg}`);
  if (!ok) failed = true;
}

async function api(path, opts = {}) {
  const headers = { ...opts.headers };
  if (opts.json) {
    headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(opts.json);
  }
  const cookie = [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
  if (cookie) headers.Cookie = cookie;
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  for (const c of res.headers.getSetCookie?.() ?? []) {
    const [pair] = c.split(";");
    const i = pair.indexOf("=");
    if (i > 0) jar.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
  }
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { res, data };
}

async function loadClaudeKey() {
  if (process.env.CLAUDE_API_KEY?.trim()) return process.env.CLAUDE_API_KEY.trim();
  const envPath = join(dirname(fileURLToPath(import.meta.url)), "../.env.local");
  const raw = await readFile(envPath, "utf8").catch(() => "");
  for (const line of raw.split("\n")) {
    const m = line.match(/^CLAUDE_API_KEY=(.+)$/i);
    if (m) return m[1].trim();
  }
  return "";
}

async function testClaudeKey() {
  const key = await loadClaudeKey();
  if (!key) {
    const raw = await readFile(
      join(dirname(fileURLToPath(import.meta.url)), "../.env.local"),
      "utf8"
    ).catch(() => "");
    const hasEmpty = /^CLAUDE_API_KEY=\s*$/m.test(raw);
    log(
      false,
      "claude",
      hasEmpty
        ? "CLAUDE_API_KEY is empty — save .env.local (Cmd+S) and restart npm run dev"
        : "CLAUDE_API_KEY missing in .env.local"
    );
    return;
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL ?? "claude-haiku-4-5-20251001",
      max_tokens: 16,
      messages: [{ role: "user", content: "Reply with exactly: OK" }],
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (res.ok) {
    log(true, "claude", `API key valid (${res.status})`);
  } else {
    log(false, "claude", body?.error?.message ?? `HTTP ${res.status}`);
  }
}

async function main() {
  console.log(`\nCRM test → ${BASE}\n`);

  await testClaudeKey();

  const login = await api("/api/admin/auth", {
    method: "POST",
    json: { password: PASSWORD },
  });
  log(login.res.ok, "auth", login.res.ok ? "Logged in" : login.data?.error ?? login.res.status);

  const anon = await fetch(`${BASE}/api/admin/students`);
  log(anon.status === 401, "auth", anon.status === 401 ? "Blocks anonymous API" : `Expected 401, got ${anon.status}`);

  if (!login.res.ok) {
    console.log("\n❌ Stopped — fix login first\n");
    process.exit(1);
  }

  const sessionId = "3b2213aa-3374-4c11-aeee-f6602402f3e6";
  const ctx = await api(`/api/admin/sessions/${sessionId}`);
  if (!ctx.res.ok) {
    log(false, "session", "E2E session not found");
  } else {
    log(true, "session", `Loaded "${ctx.data.session?.title ?? sessionId}"`);

    const gen = await api(`/api/admin/sessions/${sessionId}/reviews/generate`, {
      method: "POST",
    });
    if (gen.data?.generated?.length) {
      const r = gen.data.generated[0];
      const preview = r.content.slice(0, 90).replace(/\n/g, " ");
      log(true, "review", `Generated v${r.version}: "${preview}…"`);
    } else if (gen.data?.errors?.length) {
      log(false, "review", gen.data.errors.map((e) => e.error).join("; "));
    } else {
      log(false, "review", gen.data?.error ?? "Generation failed");
    }
  }

  const studentId = "60b9a467-a453-42bc-98d8-94ffbc833ade";
  const record = await api(`/api/admin/students/${studentId}/record`);
  if (record.res.ok) {
    const { summary, attendances, reviews, payments } = record.data;
    log(
      true,
      "record",
      `档案: ${attendances?.length ?? 0} 上课 · ${reviews?.length ?? 0} 点评 · ${payments?.length ?? 0} 付款 · 剩余 ${summary?.remainingLessons ?? "?"} 课时`
    );
  } else {
    log(false, "record", record.data?.error ?? `HTTP ${record.res.status}`);
  }

  const promptRes = await api(`/api/admin/students/${studentId}/attendances/review-prompt`);
  log(
    promptRes.res.ok && typeof promptRes.data?.prompt === "string" && promptRes.data.prompt.length > 50,
    "prompt",
    promptRes.res.ok
      ? `上课点评 prompt 已加载 (${promptRes.data.prompt.length} 字)`
      : promptRes.data?.error ?? `HTTP ${promptRes.res.status}`
  );

  for (const path of ["/admin/login", "/admin", "/admin/students", `/admin/students/${studentId}`]) {
    const cookie = [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
    const res = await fetch(`${BASE}${path}`, {
      headers: cookie ? { Cookie: cookie } : {},
      redirect: "manual",
    });
    log(res.status === 200 || path === "/admin/login", "page", `${path} → ${res.status}`);
  }

  console.log(failed ? "\n❌ Some checks failed\n" : "\n✅ All checks passed\n");
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
