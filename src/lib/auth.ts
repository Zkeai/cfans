import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Twitter from "next-auth/providers/twitter";
import Credentials from "next-auth/providers/credentials";
import connectDB from "./db";
import { User } from "@/models/User";
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
          // const email = credentials?.email as string
          // const password = credentials?.password as string

          // Parse credentials using Zod schema
          const { email, password } = await signInSchema.parseAsync(credentials);

          // Check if email or password is empty
          if (!email || !password) {
            throw new Error("Please provide both email & password(请提供电子邮件和密码)");
          }

          await connectDB();

          // Check if user exists
          const user = await User.findOne({ email }).select("+password +role");

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
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.role = user.role;
        token.sub = user.id;
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
          const { name, image, id } = user

          if (email === undefined) {
            email = `${name}@cfans.com`
          }
          await connectDB();
          const alreadyUser = await User.findOne({ email });

          if (!alreadyUser) {
            // If the user doesn't exist, create a new one
            await User.create({ email, name, image, authProviderId: id, balance: 0 });
            return true;
          } else {
            // If the user exists, just return true
            return true;
          }
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