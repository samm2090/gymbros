import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HomeClient from "./components/HomeClient";
import { authOptions } from "@/lib/infrastructure/google-auth.infra";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return <HomeClient />;
}

