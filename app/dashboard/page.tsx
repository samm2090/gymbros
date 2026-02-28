import { authOptions } from "@/lib/infrastructure/google-auth.infra";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardClient from "../components/DashboardClient";
import { getCurrentWeeklyUsersWorkouts } from "@/lib/services/workout-sessions.service";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const users = await getCurrentWeeklyUsersWorkouts();
  
  return <DashboardClient users={users} session={session} />;
}

