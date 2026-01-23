import { authOptions } from "@/lib/infrastructure/google-auth.infra";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
