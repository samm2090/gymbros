import { recordSession } from "@/lib/services/workout-sessions.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.formData();
  const file = payload.get("file") as File;
  const userId = (await cookies()).get("userId")?.value || "";

  await recordSession(userId, file);

  return NextResponse.json({ success: true });
}
