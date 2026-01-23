import { authOptions } from "@/lib/infrastructure/google-auth.infra";
import {
  getUsersSessions,
  recordSession,
} from "@/lib/services/workout-sessions.service";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.formData();
  const file = payload.get("file") as File;
  const session = await getServerSession(authOptions);

  await recordSession(session?.user?.id || "", file);

  const userSessions = await getUsersSessions();

  return NextResponse.json({ userSessions });
}
