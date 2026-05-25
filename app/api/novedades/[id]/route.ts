import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }

  const usuario = await prisma.usuario.findUnique({ where: { correo: session.user.email } })
  if (!usuario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }

  const novedad = await prisma.novedad.findUnique({ where: { id } })
  if (!novedad) {
    return NextResponse.json({ error: "Novedad no encontrada" }, { status: 404 })
  }

  if (novedad.usuarioId !== usuario.id && usuario.tipo !== "ADMIN") {
    return NextResponse.json({ error: "No tienes permiso para eliminar esta novedad" }, { status: 403 })
  }

  await prisma.novedad.delete({ where: { id } })
  return NextResponse.json({ message: "Novedad eliminada" })
}
