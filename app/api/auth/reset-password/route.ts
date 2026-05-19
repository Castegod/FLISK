import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { createHash } from "crypto"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const resetSchema = z.object({
  token: z.string(),
  contrasena: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = resetSchema.safeParse(body)
    if (!parsed.success) {
      let message = "Error de validación"
      try { message = JSON.parse(parsed.error.message)[0]?.message || message } catch {}
      return NextResponse.json({ error: message }, { status: 400 })
    }
    const { token, contrasena } = parsed.data

    const hashToken = createHash("sha256").update(token).digest("hex")

    const usuario = await prisma.usuario.findFirst({
      where: {
        resetToken: hashToken,
        resetTokenExpiry: { gt: new Date() },
      },
    })

    if (!usuario) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 })
    }

    const hashedPassword = await hash(contrasena, 10)

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        contrasena: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return NextResponse.json({ message: "Contraseña restablecida exitosamente" })
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
