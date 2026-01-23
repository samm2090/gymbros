import { authOptions } from "@/lib/infrastructure/google-auth.infra";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardClient from "../components/DashboardClient";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return <DashboardClient session={session} />;
}

