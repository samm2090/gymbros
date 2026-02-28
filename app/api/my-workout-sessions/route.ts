import { authOptions } from "@/lib/infrastructure/google-auth.infra";
import { getUserWorkOuts } from "@/lib/services/workout-sessions.service";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  const result = await getUserWorkOuts(session?.user?.id || "");

  return NextResponse.json(result);
}
