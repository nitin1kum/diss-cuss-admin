import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      username?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
    accessToken : JWT
  }

  interface User {
    id?: string;
    username?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  }
}
