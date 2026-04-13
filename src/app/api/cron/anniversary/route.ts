import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

// 22.02.2026 14:05 по МСК (UTC+3) => 2026-02-22T11:05:00.000Z
const START_MS = Date.parse("2026-02-22T11:05:00.000Z");

function dayIndex(nowMs: number) {
  // whole days since start, starting at 1 on first full day boundary
  const diff = Math.max(0, nowMs - START_MS);
  return Math.floor(diff / 86400000);
}

function monthIndex30(days: number) {
  return Math.floor(days / 30);
}

function isTriggerDay(days: number) {
  // monthly: 30, 60, 90... and special: 365
  if (days === 365) return true;
  return days > 0 && days % 30 === 0;
}

function formatSubject(days: number) {
  if (days === 365) return "Юбилей: 1 год вместе — Вика и Даня";
  const m = monthIndex30(days);
  return `Праздник: ${m} ${m === 1 ? "месяц" : "месяца"} — Вика и Даня`;
}

function formatText(days: number) {
  if (days === 365) {
    return [
      "Поздравляем пару — Вику и Даню!",
      "",
      "Сегодня юбилей: 1 год с момента знакомства.",
      "Пусть будет ещё больше любви, тепла и совместных воспоминаний.",
      "",
      "С любовью, ваш маленький сервер ❤"
    ].join("\n");
  }
  const m = monthIndex30(days);
  return [
    "Поздравляем пару — Вику и Даню!",
    "",
    `Сегодня вашему мэтчу ${m} ${m === 1 ? "месяц" : "месяца"} (≈ ${days} дней).`,
    "Пусть этот месяц будет ещё одним красивым шагом вместе.",
    "",
    "С любовью, ваш маленький сервер ❤"
  ].join("\n");
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  // Security for cron endpoint
  const secret = process.env.CRON_SECRET?.trim();
  const provided =
    url.searchParams.get("secret") ??
    req.headers.get("x-cron-secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";

  if (!secret || provided !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const forceDays = url.searchParams.get("days");
  const nowMs = Date.now();
  const days = forceDays ? Number(forceDays) : dayIndex(nowMs);

  if (!Number.isFinite(days) || days < 0) {
    return NextResponse.json({ ok: false, error: "bad_days" }, { status: 400 });
  }

  const shouldSend = isTriggerDay(days);
  if (!shouldSend) {
    return NextResponse.json({ ok: true, sent: false, days });
  }

  const from = (process.env.EMAIL_FROM ?? "").trim();
  const to = (process.env.EMAIL_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const host = process.env.SMTP_HOST?.trim() ?? "";
  const port = Number(process.env.SMTP_PORT ?? "");
  const secure = String(process.env.SMTP_SECURE ?? "true") === "true";
  const user = process.env.SMTP_USER?.trim() ?? "";
  const pass = process.env.SMTP_PASS?.trim() ?? "";

  if (!host || !port || !user || !pass || !from || to.length === 0) {
    return NextResponse.json({ ok: false, error: "missing_smtp_env" }, { status: 503 });
  }

  const subject = formatSubject(days);
  const text = formatText(days);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });

  const info = await transporter.sendMail({
    from,
    to: to.join(","),
    subject,
    text
  });

  return NextResponse.json({ ok: true, sent: true, days, id: info.messageId ?? null });
}

