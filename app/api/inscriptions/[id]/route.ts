import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function validateId(id: string) {
  const num = Number(id)
  if (isNaN(num) || num <= 0) return { error: "ID inválido", status: 400 }
  return num
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const id = validateId(params.id)
    if (typeof id !== "number") return NextResponse.json(id, { status: id.status })

    const inscripcion = await prisma.inscripcion.findUnique({ where: { id } })

    if (!inscripcion) {
      return NextResponse.json({ error: "Inscripción no encontrada" }, { status: 404 })
    }

    if (inscripcion.usuarioId !== Number(session.user.id)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    await prisma.inscripcion.delete({ where: { id } })
    return NextResponse.json({ message: "Inscripción cancelada" })
  } catch {
    return NextResponse.json({ error: "Error al cancelar inscripción" }, { status: 500 })
  }
}
