import { Resend } from "resend";
import { checkContactRateLimit, getClientIp, hashIp } from "@/lib/ratelimit";
import { isAllowedOrigin } from "@/lib/origin";

// Same limits as the client form in components/ContactForm.tsx.
const NAME_MIN = 2;
const NAME_MAX = 80;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1000;
const EMAIL_MAX = 254;
const MAX_BODY_BYTES = 8_000;

const ALLOWED_KEYS = new Set(["name", "email", "message", "website"]);
const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
// Line breaks are header-injection characters in name and email.
const LINE_BREAKS = /[\r\n\u2028\u2029]/;
// Control characters except tab and newline (kept for the message body).
const CONTROL_CHARS = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g;

const MESSAGES = {
  forbidden: "Requests are only accepted from this website.",
  badRequest: "Please check the form and try again.",
  limit: "You have sent several messages already. Please try again later.",
  notConfigured:
    "The contact form is not available right now. Please email me directly using the address shown on this page.",
  failed:
    "Your message could not be sent. Please try again later or email me directly using the address shown on this page.",
} as const;

function jsonError(error: string, status: number): Response {
  return Response.json({ error }, { status });
}

/** Logs only a status code and a short error type, never content or addresses. */
function logError(status: number, type: string): void {
  console.error(`[contact] ${status} ${type}`);
}

type Fields = { name: string; email: string; message: string; honeypot: boolean };
type ParseResult = { ok: true; fields: Fields } | { ok: false; error: string };

function parseFields(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, error: MESSAGES.badRequest };
  }
  const record = body as Record<string, unknown>;
  if (Object.keys(record).some((key) => !ALLOWED_KEYS.has(key))) {
    return { ok: false, error: MESSAGES.badRequest };
  }
  const { name, email, message, website } = record;
  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return { ok: false, error: MESSAGES.badRequest };
  }
  if (website !== undefined && typeof website !== "string") {
    return { ok: false, error: MESSAGES.badRequest };
  }

  if (LINE_BREAKS.test(name) || LINE_BREAKS.test(email)) {
    return { ok: false, error: "Name and email must be on a single line." };
  }

  const cleanName = name.replace(CONTROL_CHARS, "").replace(/\s+/g, " ").trim();
  const cleanEmail = email.replace(CONTROL_CHARS, "").trim();
  const cleanMessage = message
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARS, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (cleanName.length < NAME_MIN || cleanName.length > NAME_MAX) {
    return { ok: false, error: `Name must be ${NAME_MIN} to ${NAME_MAX} characters.` };
  }
  if (cleanEmail.length > EMAIL_MAX || !EMAIL_PATTERN.test(cleanEmail)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (cleanMessage.length < MESSAGE_MIN || cleanMessage.length > MESSAGE_MAX) {
    return { ok: false, error: `Message must be ${MESSAGE_MIN} to ${MESSAGE_MAX} characters.` };
  }

  return {
    ok: true,
    fields: {
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      honeypot: typeof website === "string" && website.trim() !== "",
    },
  };
}

let resend: Resend | null = null;

export async function POST(request: Request): Promise<Response> {
  // 1. Only accept requests coming from this site.
  if (!isAllowedOrigin(request)) {
    return jsonError(MESSAGES.forbidden, 403);
  }

  // 2. JSON only, small bodies only.
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return jsonError(MESSAGES.badRequest, 415);
  }
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return jsonError(MESSAGES.badRequest, 413);
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return jsonError(MESSAGES.badRequest, 413);
    body = JSON.parse(text);
  } catch {
    return jsonError(MESSAGES.badRequest, 400);
  }

  // 3. Validate and clean every field.
  const parsed = parseFields(body);
  if (!parsed.ok) return jsonError(parsed.error, 400);
  const { name, email, message, honeypot } = parsed.fields;

  // 4. Bots that fill the hidden field get a fake success, nothing is sent.
  if (honeypot) {
    return Response.json({ ok: true });
  }

  // 5. Configuration check.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    logError(503, "missing_config");
    return jsonError(MESSAGES.notConfigured, 503);
  }

  // 6. Per-visitor rate limit (IP is hashed). Fail closed if the store is down.
  try {
    const allowed = await checkContactRateLimit(hashIp(getClientIp(request.headers)));
    if (!allowed) return jsonError(MESSAGES.limit, 429);
  } catch (error) {
    logError(503, `ratelimit_${error instanceof Error ? error.name : "unknown"}`);
    return jsonError(MESSAGES.failed, 503);
  }

  // 7. Send as plain text only, so no HTML from the visitor is ever rendered.
  resend ??= new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}\n`,
    });
    if (error) {
      logError(502, `resend_${error.name ?? "error"}`);
      return jsonError(MESSAGES.failed, 502);
    }
  } catch (error) {
    logError(502, error instanceof Error ? error.name : "unknown");
    return jsonError(MESSAGES.failed, 502);
  }

  return Response.json({ ok: true });
}
