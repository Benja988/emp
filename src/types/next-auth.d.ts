// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend User type to include `role`
declare module "next-auth" {
  interface User extends DefaultUser {
    role: "customer" | "vendor" | "admin";
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "customer" | "vendor" | "admin";
    } & DefaultSession["user"];
  }

  interface JWT {
    role: "customer" | "vendor" | "admin";
  }
}
