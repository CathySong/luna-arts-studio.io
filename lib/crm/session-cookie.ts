/**
 * Edge-safe CRM session primitives (middleware + Route Handlers share this).
 */

import type { NextRequest, NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "ADMIN_PASSWORD_SESSION";

const ENC = new TextEncoder();

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    ENC.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function uint8ToHex(u8: Uint8Array): string {
  return Array.from(u8, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function signPayload(secret: string, body: string): Promise<string> {
  const key = await importHmacKey(secret);
  const digest = await crypto.subtle.sign("HMAC", key, ENC.encode(body));
  return uint8ToHex(new Uint8Array(digest));
}

function timingSafeEqualHex(aHex: string, bHex: string): boolean {
  if (aHex.length !== bHex.length) return false;
  let out = 0;
  for (let i = 0; i < aHex.length; i++) out |= aHex.charCodeAt(i) ^ bHex.charCodeAt(i);
  return out === 0 && aHex.length > 0;
}

async function validateSignature(secret: string, body: string, sigHex: string): Promise<boolean> {
  const expected = await signPayload(secret, body);
  return timingSafeEqualHex(expected, sigHex);
}

export const CRM_ADMIN_HEADER = "x-crm-admin";

const DEFAULT_TTL_MS = 14 * 24 * 60 * 60 * 1000;

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

function parseToken(token: string): { expMs: number; nonce: string; sigHex: string } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [expMsRaw, nonce, sigHex] = parts;
  const expMs = Number(expMsRaw);
  if (!Number.isFinite(expMs) || expMs <= 0 || !nonce || !sigHex) return null;
  return { expMs, nonce, sigHex };
}

async function mintSessionToken(secret: string): Promise<string> {
  const ttl = Number(process.env.ADMIN_SESSION_TTL_MS) || DEFAULT_TTL_MS;
  const expMs = Date.now() + ttl;
  const nonce = crypto.randomUUID();
  const body = `${expMs}.${nonce}`;
  const sigHex = await signPayload(secret, body);
  return `${body}.${sigHex}`;
}

export async function validateSessionCookie(
  cookieValue: string | undefined,
  secret: string | undefined
): Promise<boolean> {
  if (!cookieValue || !secret) return false;
  const parsed = parseToken(cookieValue.trim());
  if (!parsed) return false;
  if (parsed.expMs < Date.now()) return false;
  const body = `${parsed.expMs}.${parsed.nonce}`;
  return validateSignature(secret, body, parsed.sigHex);
}

export async function isAuthenticatedFromRequest(
  req: Pick<NextRequest, "cookies">
): Promise<boolean> {
  const secret = adminPassword();
  if (!secret) return false;
  const val = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return validateSessionCookie(val, secret);
}

export async function setAuthSession(res: NextResponse): Promise<void> {
  const secret = adminPassword();
  if (!secret) throw new Error("ADMIN_PASSWORD env is missing");
  const token = await mintSessionToken(secret);
  const ttl = Number(process.env.ADMIN_SESSION_TTL_MS) || DEFAULT_TTL_MS;
  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: Math.floor(ttl / 1000),
  });
}

export function clearAuthSession(res: NextResponse): void {
  res.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
