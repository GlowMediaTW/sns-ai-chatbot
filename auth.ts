import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        const { username, password } = credentials;
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
          return {
            id: process.env.ADMIN_USERNAME,
            name: null,
            email: null,
            image: null,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async authorized({ auth }) {
      return auth !== null;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});
