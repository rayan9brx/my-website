import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const PER_MINUTE = 5;
const PER_DAY = 30;
const DEFAULT_GLOBAL_DAILY = 300;
const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * 60_000;

export type RateLimitResult =
  | { ok: true }
  | { ok: false; reason: "visitor" | "global" };

function globalDailyLimit(): number {
  const parsed = Number.parseInt(process.env.CHAT_DAILY_LIMIT ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_GLOBAL_DAILY;
}

// ---------- IP helpers ----------

/** Visitor IP from x-real-ip, falling back to the first x-forwarded-for value. */
export function getClientIp(headers: Headers): string {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "unknown";
}

let warnedNoSalt = false;

/** SHA-256 of salt + IP. The raw IP is never stored or logged. */
export function hashIp(ip: string): string {
  let salt = process.env.IP_HASH_SALT;
  if (!salt) {
    if (!warnedNoSalt) {
      console.warn("[ratelimit] IP_HASH_SALT is not set; using a built-in salt.");
      warnedNoSalt = true;
    }
    salt = "portfolio-chat-default-salt";
  }
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

// ---------- Upstash (production) ----------

type UpstashLimiters = { minute: Ratelimit; day: Ratelimit; global: Ratelimit };
let upstash: UpstashLimiters | null | undefined;

function getUpstash(): UpstashLimiters | null {
  if (upstash !== undefined) return upstash;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    upstash = null;
    return upstash;
  }
  const redis = Redis.fromEnv();
  upstash = {
    minute: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(PER_MINUTE, "1 m"),
      prefix: "chat:minute",
    }),
    day: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(PER_DAY, "1 d"),
      prefix: "chat:day",
    }),
    global: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(globalDailyLimit(), "1 d"),
      prefix: "chat:global",
    }),
  };
  return upstash;
}

// ---------- In-memory fallback (dev / single instance only) ----------

const memory = new Map<string, number[]>();
let warnedMemory = false;

function memoryHit(key: string, limit: number, windowMs: number, now: number): boolean {
  const recent = (memory.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    memory.set(key, recent);
    return false;
  }
  recent.push(now);
  memory.set(key, recent);
  return true;
}

function pruneMemory(now: number): void {
  if (memory.size < 2000) return;
  for (const [key, times] of memory) {
    if (times.every((t) => now - t >= DAY_MS)) memory.delete(key);
  }
}

function checkMemory(ipHash: string): RateLimitResult {
  if (!warnedMemory) {
    console.warn(
      "[ratelimit] Upstash is not configured; using the in-memory limiter. " +
        "This is not reliable on serverless (each instance has its own counters).",
    );
    warnedMemory = true;
  }
  const now = Date.now();
  pruneMemory(now);
  if (!memoryHit(`minute:${ipHash}`, PER_MINUTE, MINUTE_MS, now)) return { ok: false, reason: "visitor" };
  if (!memoryHit(`day:${ipHash}`, PER_DAY, DAY_MS, now)) return { ok: false, reason: "visitor" };
  if (!memoryHit("global", globalDailyLimit(), DAY_MS, now)) return { ok: false, reason: "global" };
  return { ok: true };
}

// ---------- Public API ----------

/**
 * Checks the per-visitor limits (5/min, 30/day) and then the global daily cap.
 * Visitor limits run first so one noisy visitor cannot use up the global budget.
 */
export async function checkRateLimit(ipHash: string): Promise<RateLimitResult> {
  const limiters = getUpstash();
  if (!limiters) return checkMemory(ipHash);

  const minute = await limiters.minute.limit(ipHash);
  if (!minute.success) return { ok: false, reason: "visitor" };
  const day = await limiters.day.limit(ipHash);
  if (!day.success) return { ok: false, reason: "visitor" };
  const global = await limiters.global.limit("all");
  if (!global.success) return { ok: false, reason: "global" };
  return { ok: true };
}
