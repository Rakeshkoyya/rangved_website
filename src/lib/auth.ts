import crypto from "crypto";

export const SESSION_COOKIE = "rv_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

function hmac(secret: string, value: string): string {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** Returns a stateless token "exp.signature". */
export function signSession(now: number, secret = process.env.ADMIN_SESSION_SECRET || ""): string {
  const exp = now + SESSION_TTL_MS;
  return `${exp}.${hmac(secret, `admin.${exp}`)}`;
}

export function verifySession(
  token: string | undefined,
  now: number,
  secret = process.env.ADMIN_SESSION_SECRET || ""
): boolean {
  if (!token || !secret) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < now) return false;
  return safeEqual(sig, hmac(secret, `admin.${exp}`));
}

export function checkPassword(input: string, expected = process.env.ADMIN_PASSWORD || ""): boolean {
  if (!expected) return false;
  return safeEqual(input, expected);
}

export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
