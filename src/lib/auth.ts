import { getServerSession, type NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { trpcServer } from "./trpc/trpc-server";
import { RoleType } from "@lorium/prisma-zod";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: RoleType;
      title?: string | null;
      profileUrl?: string | null;
      hostedEventIds?: string[];
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    profileUrl?: string | null;
    role: RoleType;
    title?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: RoleType;
    title?: string | null;
    profileUrl?: string | null;
    hostedEventIds?: string[];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        try {
          await trpcServer.auth.findOrCreateUser.mutate({
            email: user.email!,
            name: user.name,
            image: user.image,
          });
          return true;
        } catch (error) {
          console.error("[AUTH] Error during sign in:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, account }: any) {
      if (account) {
        try {
          const user = await trpcServer.auth.getUserByEmail.query({
            email: token.email!,
          });

          if (user) {
            token.id = user.id;
            token.role = user.role;
            token.title = user.title;
            token.profileUrl = user.profileUrl;

            if (user.role === "HOST") {
              token.hostedEventIds = user.organizer.map(
                (org: { eventId: string }) => org.eventId
              );
            }
          }
        } catch (error) {
          console.error("[AUTH] Error in JWT callback:", error);
        }

        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }: any) {
      try {
        const user = await trpcServer.auth.getUserById.query({
          id: token.id,
        });

        if (user) {
          session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.profileUrl,
            role: user.role,
            title: user.title,
            profileUrl: user.profileUrl,
            hostedEventIds:
              user.role === "HOST"
                ? user.organizer.map((org: { eventId: string }) => org.eventId)
                : undefined,
          };
        }
      } catch (error) {
        console.error("[AUTH] Error in session callback:", error);
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

// Helper to get session in server components
export const auth = () => getServerSession(authOptions);
