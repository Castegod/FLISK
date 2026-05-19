import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { sendWelcomeEmail } from "@/lib/email"

const registerSchema = z.object({
  nombre: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  correo: z.string().email("Correo inválido"),
  contrasena: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      let message = "Error de validación"
      try { message = JSON.parse(parsed.error.message)[0]?.message || message } catch {}
      return NextResponse.json({ error: message }, { status: 400 })
    }
    const { nombre, correo, contrasena } = parsed.data

    const existente = await prisma.usuario.findUnique({ where: { correo } })
    if (existente) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 409 })
    }

    const hashedPassword = await hash(contrasena, 10)

    await prisma.usuario.create({
      data: { nombre, correo, contrasena: hashedPassword },
    })

    await sendWelcomeEmail(correo, nombre).catch(() => {})

    return NextResponse.json({ message: "Usuario registrado exitosamente" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
