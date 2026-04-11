import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function normalizePin(s: string) {
  return s.replace(/\D/g, "").slice(0, 6);
}

export async function POST(req: Request) {
  const secretRaw = process.env.VIKA_LOVE_PIN?.trim() ?? "";
  const secret = normalizePin(secretRaw);
  if (secret.length !== 6) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const pinRaw =
    typeof body === "object" &&
    body !== null &&
    "pin" in body &&
    typeof (body as { pin: unknown }).pin === "string"
      ? (body as { pin: string }).pin
      : "";
  const pin = normalizePin(pinRaw);
  if (pin.length !== 6) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const a = Buffer.from(pin, "utf8");
  const b = Buffer.from(secret, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
