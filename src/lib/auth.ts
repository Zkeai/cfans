import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Twitter from "next-auth/providers/twitter";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { signInSchema } from "./zod";
import { ZodError } from "zod";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    GitHub,
    Twitter,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // Authorization logic for credentials-based login
      authorize: async (credentials) => {
        try {

          // Parse credentials using Zod schema
          const { email, password } = await signInSchema.parseAsync(credentials);

          // Check if email or password is empty
          if (!email || !password) {
            throw new Error("Please provide both email & password(请提供电子邮件和密码)");
          }



          // Check if user exists
          const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/loginWithCre`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email
            }),
          })
          const data = await res.json();
          const user = data.message
          if (!data.success) {
            throw new Error("User does not exist(用户不存在)");
          }

          if (!user) {
            throw new Error("User does not exist(用户不存在)");
          }

          // Check if the password matches
          const isMatched = await compare(password, user.password);

          if (!isMatched) {
            throw new Error("Password did not match(密码不匹配)");
          }

          // Return user data
          const userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            balance: 0,
            id: user._id,
          };

          return userData;
        } catch (error: any) {

          if (error instanceof ZodError) {

            // Return null to indicate invalid credentials or Zod validation error
            throw new Error(error["issues"][0].message);
          }


          throw new Error(error.message);
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },

  callbacks: {


    // Handle JWT token after login
    async jwt({ token, user, account }: { token: JWT; user: any; account: any }) {


      if (user && account) {
        token.role = user.role;
        token.sub = account.providerAccountId;
      }

      return token;
    },
    // Handle session object by adding role and user ID
    async session({ session, token }: { session: any; token: JWT }) {

      session.user.id = token.sub

      return session;
    },



    // SignIn callback to handle provider-specific logic (e.g., Google)
    signIn: async ({ user, account }) => {

      if (account?.provider === "google" || account?.provider === "github" || account?.provider === "twitter") {

        try {

          let { email } = user;
          const { name, image } = user
          const { providerAccountId } = account
          if (email === undefined) {
            email = `${name}@cfans.com`
          }
          const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/loginWithAuth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              name,
              image,
              authProviderId: providerAccountId,
            }),
          })
          const data = await res.json();


          return data.success

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          throw new Error("Error while creating user with Google");
        }
      }



      if (account?.provider === "credentials") {

        return true; // Return true for successful credentials login
      } else {
        return false; // Return false for other providers if not handling them
      }
    },
  },
});