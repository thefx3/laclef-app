import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/seasons/getSeasonState.server";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { seasonId?: string } | null;
  const seasonId = body?.seasonId?.trim();

  if (!seasonId) {
    return NextResponse.json({ error: "Missing seasonId" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set(COOKIE_NAME, seasonId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 an
  });

  return res;
}
