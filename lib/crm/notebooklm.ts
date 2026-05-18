/**
 * NotebookLM knowledge-base sync (optional).
 *
 * Supports two setups — configure ONE:
 *
 * A) Google NotebookLM Enterprise API (recommended if you use GCP)
 *    NOTEBOOKLM_PROJECT_NUMBER, NOTEBOOKLM_LOCATION, NOTEBOOKLM_NOTEBOOK_ID, NOTEBOOKLM_ACCESS_TOKEN
 *
 * B) Custom REST proxy (if your org exposes a NotebookLM gateway)
 *    NOTEBOOKLM_BASE_URL, NOTEBOOKLM_CORPUS_ID, NOTEBOOKLM_API_KEY (or NOTEBOOKLM_ENTERPRISE_API_KEY)
 */

import type { Student } from "./types";
import { buildStudentKnowledgeDocument } from "./knowledge";

function truthy(...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = process.env[k]?.trim();
    if (v) return v;
  }
  return undefined;
}

function utf8ToBase64(text: string): string {
  if (typeof Buffer !== "undefined") return Buffer.from(text, "utf8").toString("base64");
  return btoa(unescape(encodeURIComponent(text)));
}

export type NotebookLmMode = "google" | "proxy" | "none";

export function getNotebookLmMode(): NotebookLmMode {
  if (isGoogleNotebookLmConfigured()) return "google";
  if (isProxyNotebookLmConfigured()) return "proxy";
  return "none";
}

/** True when any NotebookLM sync path is fully configured. */
export function isNotebookLmConfigured(): boolean {
  return getNotebookLmMode() !== "none";
}

function isGoogleNotebookLmConfigured(): boolean {
  return Boolean(
    truthy("NOTEBOOKLM_PROJECT_NUMBER") &&
      truthy("NOTEBOOKLM_NOTEBOOK_ID") &&
      truthy("NOTEBOOKLM_ACCESS_TOKEN")
  );
}

function isProxyNotebookLmConfigured(): boolean {
  return Boolean(
    truthy("NOTEBOOKLM_BASE_URL") &&
      truthy("NOTEBOOKLM_CORPUS_ID") &&
      truthy("NOTEBOOKLM_ENTERPRISE_API_KEY", "NOTEBOOKLM_API_KEY")
  );
}

export function getNotebookLmSetupHint(): string {
  const mode = getNotebookLmMode();
  if (mode === "google") return "Google NotebookLM Enterprise API";
  if (mode === "proxy") return "NotebookLM REST proxy";
  return (
    "NotebookLM is optional. To enable sync, add either Google Cloud vars " +
    "(NOTEBOOKLM_PROJECT_NUMBER, NOTEBOOKLM_NOTEBOOK_ID, NOTEBOOKLM_ACCESS_TOKEN) " +
    "or proxy vars (NOTEBOOKLM_BASE_URL, NOTEBOOKLM_CORPUS_ID, NOTEBOOKLM_API_KEY) to .env.local."
  );
}

type SyncResult =
  | { ok: true; sourceId?: string; sourceName?: string }
  | { ok: false; error: string };

function proxyAuthHeader(): HeadersInit | undefined {
  const key = truthy("NOTEBOOKLM_ENTERPRISE_API_KEY", "NOTEBOOKLM_API_KEY");
  if (!key) return undefined;
  return { Authorization: `Bearer ${key}` };
}

async function syncViaProxy(text: string, title: string): Promise<SyncResult> {
  const base = truthy("NOTEBOOKLM_BASE_URL");
  const corpusId = truthy("NOTEBOOKLM_CORPUS_ID");

  if (!base || !corpusId) {
    return {
      ok: false,
      error:
        "NotebookLM REST proxy not wired: set NOTEBOOKLM_BASE_URL, NOTEBOOKLM_CORPUS_ID, and NOTEBOOKLM_API_KEY.",
    };
  }

  const proj = truthy("NOTEBOOKLM_PROJECT_ID");
  const region = truthy("NOTEBOOKLM_LOCATION");

  try {
    const res = await fetch(
      `${base.replace(/\/$/, "")}/corpora/${encodeURIComponent(corpusId)}/sources:text`,
      {
        method: "POST",
        headers: {
          ...(proxyAuthHeader() as Record<string, string>),
          "Content-Type": "application/json",
          ...(proj ? { "x-goog-user-project": proj } : {}),
          ...(region ? { "x-goog-location": region } : {}),
        },
        body: JSON.stringify({
          displayName: title,
          mimeType: "text/plain",
          payload: utf8ToBase64(text),
          encodingHint: "base64-plaintext",
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return { ok: false, error: `NotebookLM upstream ${res.status}: ${errText.slice(0, 400)}` };
    }

    const data = (await res.json().catch(() => ({}))) as { name?: string; id?: string };
    return { ok: true, sourceId: data.id ?? data.name, sourceName: title };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

async function syncViaGoogleApi(
  text: string,
  title: string,
  student: Student
): Promise<SyncResult> {
  const projectNumber = truthy("NOTEBOOKLM_PROJECT_NUMBER");
  const location = truthy("NOTEBOOKLM_LOCATION") ?? "us";
  const notebookId = truthy("NOTEBOOKLM_NOTEBOOK_ID");
  const accessToken = truthy("NOTEBOOKLM_ACCESS_TOKEN");

  if (!projectNumber || !notebookId || !accessToken) {
    return {
      ok: false,
      error:
        "Google NotebookLM not configured: set NOTEBOOKLM_PROJECT_NUMBER, NOTEBOOKLM_NOTEBOOK_ID, and NOTEBOOKLM_ACCESS_TOKEN.",
    };
  }

  const sourceName = `student-${student.id}-${student.name.replace(/\s+/g, "-").toLowerCase()}`;
  const baseUrl = `https://${location}-discoveryengine.googleapis.com/v1alpha/projects/${projectNumber}/locations/${location}/notebooks/${notebookId}`;

  if (student.notebooklmSourceName) {
    try {
      await fetch(`${baseUrl}/sources:batchDelete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ names: [student.notebooklmSourceName] }),
      });
    } catch {
      // prior source may already be gone
    }
  }

  try {
    const res = await fetch(`${baseUrl}/sources:batchCreate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userContents: [
          {
            textContent: {
              sourceName,
              content: text,
            },
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return { ok: false, error: `NotebookLM API ${res.status}: ${errText.slice(0, 400)}` };
    }

    const data = (await res.json()) as {
      sources?: Array<{
        sourceId?: { id?: string };
        name?: string;
      }>;
    };

    const source = data.sources?.[0];
    const sourceId = source?.sourceId?.id;
    const sourceResourceName = source?.name;

    if (!sourceId || !sourceResourceName) {
      return { ok: false, error: "NotebookLM returned an unexpected response" };
    }

    return { ok: true, sourceId, sourceName: sourceResourceName };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function syncStudentNotebook(student: Student): Promise<SyncResult> {
  const body = buildStudentKnowledgeDocument(student);
  const title = `${student.name} — Luna CRM profile (${student.id.slice(0, 8)})`;

  const mode = getNotebookLmMode();
  if (mode === "none") {
    return { ok: false, error: getNotebookLmSetupHint() };
  }

  if (mode === "google") {
    return syncViaGoogleApi(body, title, student);
  }

  return syncViaProxy(body, title);
}
