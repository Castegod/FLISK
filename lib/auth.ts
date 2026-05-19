import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        correo: { label: "Correo", type: "email" },
        contrasena: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.correo || !credentials?.contrasena) {
          throw new Error("Correo y contraseña requeridos")
        }

        const usuario = await prisma.usuario.findUnique({
          where: { correo: credentials.correo },
        })

        if (!usuario || !usuario.estado) {
          throw new Error("Credenciales inválidas")
        }

        const valid = await compare(credentials.contrasena, usuario.contrasena)
        if (!valid) {
          throw new Error("Credenciales inválidas")
        }

        return {
          id: String(usuario.id),
          email: usuario.correo,
          name: usuario.nombre,
          role: usuario.tipo,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
}
