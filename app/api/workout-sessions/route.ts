import { authOptions } from "@/lib/infrastructure/google-auth.infra";
import {
  getStatistics,
  recordSession,
} from "@/lib/services/workout-sessions.service";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.formData();
  const file = payload.get("file") as File;
  const session = await getServerSession(authOptions);

  const result = await recordSession(session?.user?.id || "", file);

  return NextResponse.json(result);
}

export async function GET() {
  const result = await getStatistics();

  return NextResponse.json(result);
}
