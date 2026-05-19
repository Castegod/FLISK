import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createHash, randomBytes } from "crypto"

export async function POST(req: Request) {
  try {
    const { correo } = await req.json()

    const usuario = await prisma.usuario.findUnique({ where: { correo } })
    if (!usuario) {
      return NextResponse.json({ message: "Si el correo existe, recibirás un enlace de recuperación" })
    }

    const token = randomBytes(32).toString("hex")
    const hash = createHash("sha256").update(token).digest("hex")

    const expiry = new Date(Date.now() + 3600000)

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        resetToken: hash,
        resetTokenExpiry: expiry,
      },
    })

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@filsk.app",
      to: correo,
      subject: "Recuperación de contraseña - FILSK",
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px">Restablecer contraseña</a>
        <p>Este enlace expira en 1 hora.</p>
      `,
    })

    return NextResponse.json({ message: "Si el correo existe, recibirás un enlace de recuperación" })
  } catch {
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
