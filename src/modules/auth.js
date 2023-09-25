import ConnectToDatabase from "@/modules/mongodb";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true
    }),
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      const { db } = await ConnectToDatabase();
      const loginProvider = account.provider;

      const users = db.collection("Users");
      const userExists = await users.findOne({
        email: user.email
      });

      if (loginProvider === "google") {
        if (!userExists) {
          const newUser = {
            name: user.name,
            email: user.email,
            createdAt: new Date().toISOString().split("T")[0],
          };

          const response = await users.insertOne(newUser);
          if (response.insertedId) {
            return true;
          }
          else {
            throw new Error("Failed To Create User");
          }
        }
        return true;
      }
    },
    session: async({ session, token }) => {
      session.user = token;
      return session;
    },
    jwt: async({ token, user, trigger, session }) => {
      if (trigger === "update") {
        return {
          ...token,
          ...session.user,
        }
      }
      return {
        ...token,
        ...user,
      }
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export { authOptions };