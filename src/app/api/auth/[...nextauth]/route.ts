import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma with Neon adapter
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                profileUrl: user.image,
                role: "REGISTRANT",
              },
            });
          }

          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, account }: any) {
      if (account) {
        const user = await prisma.user.findUnique({
          where: { email: token.email! },
          select: {
            id: true,
            role: true,
            title: true,
            profileUrl: true,
          },
        });

        if (user) {
          token.id = user.id;
          token.role = user.role;
          token.title = user.title;
          token.profileUrl = user.profileUrl;
        }

        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }: any) {
      const user = await prisma.user.findUnique({
        where: { id: token.id },
        select: {
          id: true,
          email: true,
          name: true,
          profileUrl: true,
          role: true,
          title: true,
        },
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
        };
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
