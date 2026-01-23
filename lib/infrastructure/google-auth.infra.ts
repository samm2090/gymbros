import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getDB } from "./mongo-client.infra";
import { DbTables } from "../types/db-tables.enum";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      const db = await getDB();

      const existingUser = await db
        .collection(DbTables.USERS)
        .findOne({ email: user.email });

      if (!existingUser) {
        await db.collection(DbTables.USERS).insertOne({
          email: user.email,
          name: user.name,
          profilePicture: user.image,
          createdAt: new Date(),
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const db = await getDB();

        const dbUser = await db
          .collection(DbTables.USERS)
          .findOne({ email: user.email });

        if (dbUser) {
          token.userId = String(dbUser._id);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId;
      }
      return session;
    },
  },
};
