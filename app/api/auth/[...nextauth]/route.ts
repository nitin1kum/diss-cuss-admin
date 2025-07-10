import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {SignJWT} from 'jose'

const signToken = async (token: any) => {
  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
  return await new SignJWT(token)
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/auth`,{
            method : "POST",
            body : JSON.stringify({
              email : credentials?.email,
              password : credentials?.password
            }),
            headers : {
              "Content-Type" : "application/json"
            }
          });

          const data = await res.json();
          return data as User;
        } catch (error) {
          console.log("Error while authorizing user", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = {
          email: user.email,
          role: user.role,
          id : user.id,
          image : user.image,
          username : user.username
        };
      }
      return token;
    },
    async session({ session, token }) {
      const accessToken = await signToken(token);
      if (token) {
        session.user = {
          email: token.email,
          role: token.role,
          id : token.id,
          image : token.image,
          username : token.username
        };
        session.accessToken = accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
