import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import User from '@/models/User'
import { dbConnect } from '@/lib/db'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect()
        const user = await User.findOne({ email: credentials?.email }).select(
          '+password'
        )

        if (!user) throw new Error('User not found')

        const isValidPassword = await bcrypt.compare(
          credentials!.password,
          user.password
        )
        if (!isValidPassword) throw new Error('Invalid credentials')

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as 'customer' | 'vendor' | 'admin' // ✅ Explicitly type `role`
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as 'customer' | 'vendor' | 'admin' // ✅ Ensure session.user.role is correctly typed
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login',
  },
})
