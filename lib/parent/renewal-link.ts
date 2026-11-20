import { createHash, randomBytes } from "node:crypto";

export function createRenewalToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashRenewalToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
