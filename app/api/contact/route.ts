import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)
const from = process.env.EMAIL_FROM || "noreply@filsk.app"
const to = process.env.CONTACT_EMAIL || from

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { asunto, mensaje } = await req.json()
  if (!asunto || !mensaje) {
    return NextResponse.json({ error: "Asunto y mensaje son requeridos" }, { status: 400 })
  }

  await resend.emails.send({
    from,
    to,
    subject: `[FILSK Contacto] ${asunto}`,
    html: `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Usuario:</strong> ${session.user.name} (${session.user.email})</p>
      <p><strong>Asunto:</strong> ${asunto}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${mensaje.replace(/\n/g, "<br>")}</p>
    `,
  })

  return NextResponse.json({ message: "Mensaje enviado" })
}
